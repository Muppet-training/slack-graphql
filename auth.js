import jwt from 'jsonwebtoken';
import _ from 'lodash';
import bcrypt from 'bcrypt';

export const tryLogin = async (email, password, models, SECRET) => {
	const user = await models.User.findOne({
		where: { email },
		raw: true
	});
	if (!user) {
		// User with provided email not found
		return {
			ok: false,
			errors: [
				{
					path: 'email',
					message:
						'The email provided has not been registered would you like to sign up?'
				}
			]
		};
	}

	const valid = await bcrypt.compare(password, user.password);
	if (!valid) {
		// Bad password attempt
		return {
			ok: false,
			errors: [
				{
					path: 'password',
					message:
						'The password does not match the user account provided..'
				}
			]
		};
	}

	const [ token, refreshToken ] = await createTokens(
		user,
		SECRET,
		user.refreshSecret
	);

	return {
		ok: true,
		token,
		refreshToken
	};
};
