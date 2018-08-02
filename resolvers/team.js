import formatErrors from '../utils/formatErrors';
import requiresAuth from '../utils/permissions';

export default {
	Mutation: {
		createTeam: requiresAuth.createResolver(
			async (parent, args, context) => {
				try {
					await context.models.Team.create({
						...args,
						owner: context.user.id
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
		)
	}
};
