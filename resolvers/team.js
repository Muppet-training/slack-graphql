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
		createTeam: requiresAuth.createResolver(
			async (parent, args, context) => {
				try {
					const team = await context.models.Team.create({
						...args,
						owner: context.user.id
					});
					await context.models.Channel.create({
						name: 'genral',
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
