module.exports = {
	extends: 'airbnb-base',
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
		'array-bracket-spacing': 0,
		camelcase: 0,
		'comma-dangle': [ 'error', 'never' ],
		'max-len': 0,
		indent: [
			2,
			'tab',
			{ SwitchCase: 1, VariableDeclarator: 1 }
		],
		'no-tabs': 0,
		'no-console': 'off'
	}
};
