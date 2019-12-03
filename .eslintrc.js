module.exports = {
	root: true,
	parser: 'babel-eslint',
	env: {
		browser: true
	},
	plugins: ['react', 'react-native'],
	// extends: '@react-native-community',
	extends: ['eslint:recommended', 'plugin:react/recommended'],
	rules: {
		'no-empty': [0],
		'react/prop-types': [0]
	},
	globals: {
		global: false
	}
};
