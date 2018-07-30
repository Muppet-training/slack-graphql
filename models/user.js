import bcrypt from 'bcrypt';

export default (sequlize, DataTypes) => {
	const User = sequlize.define(
		'user',
		{
			username: {
				type: DataTypes.STRING,
				unique: true,
				validate: {
					isAlphanumeric: {
						args: true,
						msg:
							'The username can only container letters and numbers..'
					},
					len: {
						args: [ 3, 25 ],
						msg:
							'The username needs to be between 3 & 25 characters long'
					}
				}
			},
			email: {
				type: DataTypes.STRING,
				unique: true,
				validate: {
					isEmail: {
						args: true,
						msg: 'Your email looks to be invalid..'
					}
				}
			},
			password: {
				type: DataTypes.STRING,
				validate: {
					len: {
						args: [ 5, 99 ],
						msg:
							'The password needs to be between 5 and 99 characters long'
					}
				}
			}
		},
		{
			hooks: {
				afterValidate: async (user) => {
					const hashedPassword = await bcrypt.hash(
						user.password,
						12
					);
					// eslint-disable-next-line no-param-reassign
					user.password = hashedPassword;
				}
			}
		}
	);

	User.associate = (models) => {
		User.belongsToMany(models.Team, {
			through: 'member',
			foreignKey: 'user_id'
		});
		// N:M
		User.belongsToMany(models.Channel, {
			through: 'channel_member',
			foreignKey: 'user_id'
		});
	};

	return User;
};

// [Message!]! = The message Type as in it's fields should not be null & the entire array should not be null aswell
// [Message!]! = Both the array and the objects in each array are not null
