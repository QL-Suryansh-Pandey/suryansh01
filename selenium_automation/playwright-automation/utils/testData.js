const users = require('../test-data/users.json');

function getValidUser() {
	return {
		username: process.env.TEST_USERNAME || users.validUser.username,
		password: process.env.TEST_PASSWORD || users.validUser.password,
	};
}

module.exports = { getValidUser };
