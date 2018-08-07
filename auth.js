import jwt from 'jsonwebtoken';
import _ from 'lodash';
import bcrypt from 'bcrypt';

export const createTokens = async (user, secret, secret2) => {
	const createToken = jwt.sign(
		{
			user: _.pick(user, [ 'id', 'username' ])
		},
		secret,
		{
			expiresIn: '20m'
		}
	);

	const createRefreshToken = jwt.sign(
		{
			user: _.pick(user, 'id')
		},
		secret2,
		{
			expiresIn: '7d'
		}
	);

	return [ createToken, createRefreshToken ];
};

export const refreshTokens = async (
	token,
	refreshToken,
	models,
	SECRET,
	SECRET2
) => {
	let userId = 0;
	try {
		const { user: { id } } = jwt.decode(refreshToken);
		userId = id;
	} catch (err) {
		return {};
	}

	if (!userId) {
		return {};
	}

	const user = await models.User.findOne({
		where: { id: userId },
		raw: true
	});

	if (!user) {
		return {};
	}

	const refreshSecret = user.password + SECRET2;

	try {
		jwt.verify(refreshToken, refreshSecret);
	} catch (err) {
		return {};
	}

	const [ newToken, newRefreshToken ] = await createTokens(
		user,
		SECRET,
		refreshSecret
	);
	return {
		token: newToken,
		refreshToken: newRefreshToken,
		user
	};
};

export const tryLogin = async (
	email,
	password,
	models,
	SECRET,
	SECRET2
) => {
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

	// user.password is the hashed password
	// These are joined together so if the user changes their password it will automatically log them out
	const refreshTokenSecret = user.password + SECRET2;

	const [ token, refreshToken ] = await createTokens(
		user,
		SECRET,
		refreshTokenSecret
	);

	// token = '7362hdsfaj12.hjsadgfku342.dfsadf093'
	// refreshTssoken = '7362hdsfaj12.hjsadgfku342.dfsadf093'

	return {
		ok: true,
		token,
		refreshToken
	};
};
