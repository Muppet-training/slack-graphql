import bcrypt from 'bcrypt';

export default (sequlize, DataTypes) => {
	const User = sequlize.define('user', {
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
			type: DataTypes.STRING
		}
	});

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
