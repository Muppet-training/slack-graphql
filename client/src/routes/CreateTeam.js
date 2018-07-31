import React, { Component } from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {
	Button,
	Form,
	Input,
	Container,
	Header,
	Message
} from 'semantic-ui-react';

class CreateTeam extends Component {
	constructor(props) {
		super(props);

		extendObservable(this, {
			name: '',
			errors: {}
		});
	}

	onSubmit = async () => {
		const { name } = this;
		const { mutate, history } = this.props;
		const response = await mutate({
			variables: { name }
		});
		console.log(response);
		const { ok, errors } = response.data.createTeam;

		if (ok) {
			history.push('/');
		} else {
			const err = {};
			errors.forEach(({ path, message }) => {
				// err['passwordError'] = 'too short...';
				err[`${path}Error`] = message;
			});

			this.errors = err;
		}
	};

	onChange = (e) => {
		const { name, value } = e.target;
		this[name] = value;
	};

	render() {
		const { name, errors: { nameError } } = this;

		const errorList = [];

		if (nameError) {
			errorList.push(nameError);
		}

		return (
			<Container text>
				<Header as="h2"> Create a Team </Header>
				<Form>
					<Form.Field error={!!nameError}>
						<Input
							name="name"
							onChange={this.onChange}
							value={name}
							placeholder="Name"
							fluid
						/>
					</Form.Field>
					<Button onClick={this.onSubmit}> Login </Button>
				</Form>
				{errorList.length ? (
					<Message
						error
						header="There were some errors with your submission"
						list={errorList}
					/>
				) : null}
			</Container>
		);
	}
}

const createTeamMutation = gql`
	mutation($name: String!) {
		createTeam(name: $name) {
			ok
			errors {
				path
				message
			}
		}
	}
`;

export default graphql(createTeamMutation)(observer(CreateTeam));
