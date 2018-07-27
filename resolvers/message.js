export default {
	Mutation: {
		createMessage: async (parent, args, context, info) => {
			try {
				await context.models.Message.create({
					...args,
					user_id: context.user.id
				});
				return true;
			} catch (err) {
				console.log(err);
				return false;
			}
		}
	}
};
