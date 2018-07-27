import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
	Container,
	Header,
	Input,
	Button,
	Message
} from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Register extends Component {
	state = {
		username: '',
		email: '',
		password: '',
		usernameError: '',
		emailError: '',
		passwordError: ''
	};

	onChange = (e) => {
		const { name, value } = e.target;
		this.setState({ [name]: value });
	};

	onSubmit = async (e) => {
		this.setState({
			usernameError: '',
			emailError: '',
			passwordError: ''
		});

		const { username, email, password } = this.state;
		const response = await this.props.mutate({
			variables: { username, email, password }
		});

		const { ok } = response.data.register;

		if (ok) {
			this.props.history.push('/');
		} else {
			const err = {};
			response.data.register.errors.forEach(
				({ path, message }) => {
					err[`${path}Error`] = message;
					// err['passwordError'] = 'too short..'
				}
			);
			this.setState(err);
		}

		console.log(response);
	};

	render() {
		// console.log('Props ', this.props.history.push('/'));

		const {
			username,
			email,
			password,
			usernameError,
			emailError,
			passwordError
		} = this.state;

		const errorList = [];
		if (usernameError) {
			errorList.push(usernameError);
		}
		if (emailError) {
			errorList.push(emailError);
		}
		if (passwordError) {
			errorList.push(passwordError);
		}

		return (
			<Container text>
				<Header as="h2">Register</Header>
				<Input
					// Cast the error to a boolean with a !! sign
					// Therefore..
					// ''     false
					// !''    true
					// !!''   false
					error={!!usernameError}
					name="username"
					onChange={this.onChange}
					value={username}
					placeholder="username"
					fluid
				/>
				<Input
					error={!!emailError}
					name="email"
					onChange={this.onChange}
					value={email}
					placeholder="email"
					fluid
				/>
				<Input
					error={!!passwordError}
					name="password"
					onChange={this.onChange}
					value={password}
					placeholder="password"
					fluid
					type="password"
				/>
				<Button onClick={this.onSubmit}>Submit</Button>
				{usernameError || emailError || passwordError ? (
					<Message
						error
						header="There was some errors with your submission"
						list={errorList}
					/>
				) : null}
			</Container>
		);
	}
}

const registerMutation = gql`
	mutation(
		$username: String!
		$password: String!
		$email: String!
	) {
		register(
			username: $username
			email: $email
			password: $password
		) {
			ok
			errors {
				path
				message
			}
		}
	}
`;

export default withRouter(graphql(registerMutation)(Register));
