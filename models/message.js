export default (sequelize, DataTypes) => {
	const Message = sequelize.define('message', {
		text: DataTypes.STRING
	});

	Message.associate = (models) => {
		// 1:M = 1:Many
		Message.belongsTo(models.Channel, {
			foreignKey: 'channel_id'
		});
		Message.belongsTo(models.User, {
			foreignKey: 'user_id'
		});
	};
	return Message;
};
