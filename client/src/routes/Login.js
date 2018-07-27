import React, { Component } from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Button, Input, Container, Header } from 'semantic-ui-react';

export default observer(
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

		onSubmit = () => {
			const { email, password } = this;
			console.log(email);
			console.log(password);
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
);
