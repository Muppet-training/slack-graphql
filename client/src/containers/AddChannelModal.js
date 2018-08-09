import React from 'react';
import _ from 'lodash';
import { Form, Input, Button, Modal } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import { allTeamsQuery } from '../graphql/team';

const AddChannelModal = ({
	open,
	onClose,
	values,
	handleChange,
	handleBlur,
	handleSubmit,
	isSubmitting
}) => (
	<Modal open={open} onClose={onClose}>
		<Modal.Header>Add Channel</Modal.Header>
		<Modal.Content>
			<Form>
				<Form.Field>
					<Input
						value={values.name}
						onChange={handleChange}
						onBlur={handleBlur}
						name="name"
						fluid
						placeholder="Channel name"
					/>
				</Form.Field>
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
						Create Channel
					</Button>
				</Form.Group>
			</Form>
		</Modal.Content>
	</Modal>
);

const createChannelMutation = gql`
	mutation($team_id: Int!, $name: String!) {
		createChannel(team_id: $team_id, name: $name) {
			ok
			channel {
				id
				name
			}
		}
	}
`;

export default compose(
	graphql(createChannelMutation),
	withFormik({
		mapPropsToValues: () => ({ name: '' }),
		handleSubmit: async (
			values,
			{ props: { onClose, team_id, mutate }, setSubmitting }
		) => {
			await mutate({
				variables: { team_id, name: values.name },
				optimisticResponse: {
					createChannel: {
						__typename: 'Mutation',
						ok: true,
						channel: {
							id: -1,
							name: values.name,
							__typename: 'Channel'
						}
					}
				},
				update: (store, { data: { createChannel } }) => {
					const { ok, channel, errors } = createChannel;

					if (!ok) {
						console.log(errors);
						return;
					}

					// Read the data from our cache for this query.
					const data = store.readQuery({
						query: allTeamsQuery
					});

					const teamIdx = findIndex(data.allTeams, [
						'id',
						team_id
					]);
					// Add our comment from the mutation to the end.
					// data.allTeams[teamIdx].channels.push(channel);

					// deep clone the 'non extensible' object into a new data object
					const writeData = _.cloneDeep(data);
					writeData.allTeams[teamIdx].channels.push(
						channel
					);

					// Write our data back to the cache.
					store.writeQuery({
						query: allTeamsQuery,
						data: writeData
					});
				}
			});
			onClose();
			setSubmitting(false);
		}
	})
)(AddChannelModal);
