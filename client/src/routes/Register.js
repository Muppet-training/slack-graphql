import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
	Container,
	Header,
	Form,
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

	onSubmit = async () => {
		console.log(this.state);
		this.setState({
			usernameError: '',
			emailError: '',
			passwordError: ''
		});

		const { username, email, password } = this.state;
		const { mutate, history } = this.props;

		const response = await mutate({
			variables: { username, email, password }
		});

		const { ok } = response.data.register;

		if (ok) {
			history.push('/');
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
				<Form>
					<Form.Field error={!!usernameError}>
						<Input
							// Cast the error to a boolean with a !! sign
							// Therefore..
							// ''     false
							// !''    true
							// !!''   false
							name="username"
							onChange={this.onChange}
							value={username}
							placeholder="username"
							fluid
						/>
					</Form.Field>
					<Form.Field error={!!emailError}>
						<Input
							name="email"
							onChange={this.onChange}
							value={email}
							placeholder="email"
							fluid
						/>
					</Form.Field>
					<Form.Field error={!!passwordError}>
						<Input
							name="password"
							onChange={this.onChange}
							value={password}
							placeholder="password"
							fluid
							type="password"
						/>
					</Form.Field>
					<Button onClick={this.onSubmit}>Submit</Button>
				</Form>
				{errorList.length ? (
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
