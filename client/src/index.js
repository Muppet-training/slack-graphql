import React from 'react';
import ReactDOM from 'react-dom';
import {
	ApolloClient,
	createNetworkInterface,
	ApolloProvider
} from 'react-apollo';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import 'semantic-ui-css/semantic.min.css';
import Routes from './routes';
import registerServiceWorker from './registerServiceWorker';

const networkInterface = createNetworkInterface({
	uri: 'http://localhost:8080/graphql'
});

networkInterface.use([
	{
		// This will be called everytime we make a mutation or request a query using graphQL
		applyMiddleware(req, next) {
			if (!req.options.headers) {
				req.options.headers = {}; // Create the header object if needed
			}
			// get the authentication token from local storage if it exists
			req.options.headers['x-token'] = localStorage.getItem(
				'token'
			);
			req.options.headers[
				'x-refresh-token'
			] = localStorage.getItem('refreshtoken');
			next();
		}
	}
]);

const client = new ApolloClient({
	link: new HttpLink({ uri: 'http://localhost:8080/graphql' }),
	cache: new InMemoryCache()
});

const App = (
	<ApolloProvider client={client}>
		<Routes />
	</ApolloProvider>
);

ReactDOM.render(App, document.getElementById('root'));
registerServiceWorker();
