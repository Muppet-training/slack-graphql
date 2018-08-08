import formatErrors from '../utils/formatErrors';

export default {
	Mutation: {
		createChannel: async (parent, args, context) => {
			try {
				const channel = await context.models.Channel.create(
					args
				);
				return {
					ok: true,
					channel
				};
			} catch (err) {
				console.log(err);
				return {
					ok: false,
					errors: formatErrors(err)
				};
			}
		}
	}
};
