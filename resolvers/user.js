// import bcrypt from 'bcrypt';
import _ from 'lodash';

import { tryLogin } from '../auth';

const formatErrors = (e, models) => {
	if (e instanceof models.sequelize.ValidationError) {
		// _.pick({a: 1, b: 2}, 'a') => {a:1ƒ}
		return e.errors.map((x) => _.pick(x, [ 'path', 'message' ]));
	}
	return [ { path: 'name', message: e } ];
};

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
