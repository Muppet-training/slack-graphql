export default compose(
	graphql(addTeamMemberMutation),
	withFormik({
		mapPropsToValues: () => ({ email: '' }),
		handleSubmit: async (
			values,
			{
				props: { onClose, teamId, mutate },
				setSubmitting,
				setErrors
			}
		) => {
			const response = await mutate({
				variables: { teamId, email: values.email }
			});
			const { ok, errors } = response.data.addTeamMember;
			if (ok) {
				onClose();
				setSubmitting(false);
			} else {
				setSubmitting(false);
				setErrors(normalizeErrors(errors));
			}
		}
	})
)(InvitePeopleModal);
