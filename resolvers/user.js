import { tryLogin } from '../auth';
import formatErrors from '../utils/formatErrors';

export default {
	Query: {
		getUser: (parent, args, { models }) =>
			models.User.findOne({ where: args.id }),
		allUsers: (parent, args, { models }) => models.User.findAll()
	},
	Mutation: {
		login: (
			parent,
			{ email, password },
			{ models, SECRET, SECRET2 }
		) => tryLogin(email, password, models, SECRET, SECRET2),

		// We pass in the models using the context connecting the two in the root index.js
		// This passes in the args into this resolver file
		register: async (parent, args, { models }) => {
			try {
				const user = await models.User.create(args);

				return {
					ok: true,
					user
				};
			} catch (err) {
				console.log(err);
				return {
					ok: false,
					errors: formatErrors(err, models)
				};
			}
		}
	}
};
