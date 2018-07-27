import bcrypt from 'bcrypt';
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
		getUser: (parent, args, { models }, Info) =>
			models.User.findOne({ where: args.id }),
		allUsers: (parent, args, { models }, Info) =>
			models.User.findAll()
	},
	Mutation: {
		login: (parent, { email, password }, { models }) =>
			tryLogin(),

		// We pass in the models using the context connecting the two in the root index.js
		// This passes in the args into this resolver file
		register: async (
			parent,
			{ password, ...otherArgs },
			{ models },
			Info
		) => {
			const hashedPassword = await bcrypt.hash(password, 12);
			try {
				if (password.length < 5 || password.length > 99) {
					return {
						ok: false,
						errors: [
							{
								path: 'password',
								message:
									'The password must be between 5 & 99 characters long'
							}
						]
					};
				}

				const user = await models.User.create({
					...otherArgs,
					password: hashedPassword
				});

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
