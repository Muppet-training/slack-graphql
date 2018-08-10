import formatErrors from '../utils/formatErrors';
import requiresAuth from '../utils/permissions';

export default {
	Query: {
		allTeams: requiresAuth.createResolver(
			async (parent, args, { models, user }) =>
				models.Team.findAll(
					{ where: { owner: user.id } },
					{ raw: true }
				)
		)
	},
	Mutation: {
		addTeamMember: requiresAuth.createResolver(
			async (parent, { email, team_id }, { models, user }) => {
				try {
					const teamPromise = models.Team.findOne(
						{ where: { id: team_id } },
						{ raw: true }
					);
					const userToAddPromise = await models.User.findOne(
						{ where: { email } },
						{ raw: true }
					);
					const [ team, userToAdd ] = await Promise.all([
						teamPromise,
						userToAddPromise
					]);

					if (team.owner !== user.id) {
						return {
							ok: false,
							errors: [
								{
									path: 'email',
									message:
										'You cannot add members to the team, you need to be the team owner..'
								}
							]
						};
					}
					if (!userToAdd) {
						return {
							ok: false,
							errors: [
								{
									path: 'email',
									message:
										'The email provided is invalid..'
								}
							]
						};
					}
					await models.Member.create({
						user_id: userToAdd.id,
						team_id
					});
					return {
						ok: true
					};
				} catch (err) {
					console.log(err);
					return {
						ok: false,
						errors: formatErrors(err)
					};
				}
			}
		),
		createTeam: requiresAuth.createResolver(
			async (parent, args, context) => {
				try {
					const team = await context.models.Team.create({
						...args,
						owner: context.user.id
					});
					await context.models.Channel.create({
						name: 'general',
						public: true,
						team_id: team.id
					});
					return {
						ok: true,
						team
					};
				} catch (err) {
					console.log(err);
					return {
						ok: false,
						errors: formatErrors(err)
					};
				}
			}
		)
	},
	Team: {
		channels: ({ id }, args, { models }) =>
			models.Channel.findAll({ where: { team_id: id } })
	}
};
