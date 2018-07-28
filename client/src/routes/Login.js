import React, { Component } from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Button, Input, Container, Header } from 'semantic-ui-react';

class Login extends Component {
	constructor(props) {
		super(props);

		extendObservable(this, {
			email: '',
			password: ''
		});
	}

	onChange = (e) => {
		const { name, value } = e.target;
		this[name] = value;
	};

	onSubmit = async () => {
		const { email, password } = this;
		const response = await this.props.mutate({
			variables: { email, password }
		});
		console.log(response);
		const { ok, token, refreshToken } = response.data.login;
		if (ok) {
			localStorage.setItem('token', token);
			localStorage.setItem('refreshToken', refreshToken);
		}
	};

	render() {
		const { email, password } = this;

		return (
			<Container text>
				<Header as="h2">Login</Header>
				<Input
					name="email"
					onChange={this.onChange}
					value={email}
					placeholder="email"
					fluid
				/>
				<Input
					name="password"
					type="password"
					onChange={this.onChange}
					value={password}
					placeholder="Password"
					fluid
				/>
				<Button onClick={this.onSubmit}>Login</Button>
			</Container>
		);
	}
}

const loginMutation = gql`
	mutation($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			ok
			token
			refreshToken
			errors {
				path
				message
			}
		}
	}
`;

export default graphql(loginMutation)(observer(Login));
