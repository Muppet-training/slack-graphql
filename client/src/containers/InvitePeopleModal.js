import React from 'react';
import { Form, Input, Button, Modal } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

import normalizeErrors from '../utils/normalizeErrors';

const InvitePeopleModal = ({
	open,
	onClose,
	values,
	handleChange,
	handleBlur,
	handleSubmit,
	isSubmitting,
	touched,
	errors
}) => (
	<Modal open={open} onClose={onClose}>
		<Modal.Header>Add User To Your Team</Modal.Header>
		<Modal.Content>
			<Form>
				<Form.Field>
					<Input
						value={values.name}
						onChange={handleChange}
						onBlur={handleBlur}
						name="email"
						fluid
						placeholder="User's email"
					/>
				</Form.Field>
				{touched.email && errors.email ? (
					errors.email[0]
				) : null}
				<Form.Group widths="equal">
					<Button
						disabled={isSubmitting}
						fluid
						onClick={onClose}
						type="button"
					>
						Cancel
					</Button>
					<Button
						disabled={isSubmitting}
						onClick={handleSubmit}
						fluid
						type="submit"
					>
						Add User
					</Button>
				</Form.Group>
			</Form>
		</Modal.Content>
	</Modal>
);

const addTeamMemberMutation = gql`
	mutation($email: String!, $team_id: Int!) {
		addTeamMember(email: $email, team_id: $team_id) {
			ok
			errors {
				path
				message
			}
		}
	}
`;

export default compose(
	graphql(addTeamMemberMutation),
	withFormik({
		mapPropsToValues: () => ({ email: '' }),
		handleSubmit: async (
			values,
			{
				props: { onClose, team_id, mutate },
				setSubmitting,
				setErrors
			}
		) => {
			const response = await mutate({
				variables: { team_id, email: values.email }
			});
			const { ok, errors } = response.data.addTeamMember;
			if (ok) {
				console.log(response);
				onClose();
				setSubmitting(false);
			} else {
				setSubmitting(false);
				setErrors(normalizeErrors(errors));
			}
		}
	})
)(InvitePeopleModal);

//File updated
