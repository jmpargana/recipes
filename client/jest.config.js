const config = {
	transform: {
		'^.+\\.js$': 'babel-jest',
		'^.+\\.svelte$': 'svelte-jester'
	},
	testEnvironment: "jsdom",
	moduleFileExtensions: ['js', 'svelte'],
	setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect']
};

export default config
