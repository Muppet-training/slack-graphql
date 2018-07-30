module.exports = {
	extends: 'airbnb',
	parser: 'babel-eslint',
	globals: {
		document: 1
	},
	env: {
		browser: 1
	},
	rules: {
		'object-curly-newline': 0,
		'implicit-arrow-linebreak': 0,
		'arrow-parens': 0,
		'react/jsx-one-expression-per-line': 0,
		'react/jsx-filename-extension': [
			1,
			{ extensions: [ '.js', '.jsx' ] }
		],
		'react/prop-types': 0,
		'comma-dangle': [ 'error', 'never' ],
		indent: [
			2,
			'tab',
			{ SwitchCase: 1, VariableDeclarator: 1 }
		],
		'no-tabs': 0,
		'react/prop-types': 0,
		'react/jsx-indent': [ 2, 'tab' ],
		'react/jsx-indent-props': [ 2, 'tab' ],
		'no-console': 'off'
	}
};
