const users = require('../test-data/users.json');

function getNewUser() {
  return {
    firstName: process.env.TEST_FIRST_NAME || users.newUser.firstName,
    lastName: process.env.TEST_LAST_NAME || users.newUser.lastName,
    email: process.env.TEST_EMAIL || users.newUser.email,
    password: process.env.TEST_PASSWORD || users.newUser.password,
    confirmPassword: process.env.TEST_PASSWORD || users.newUser.confirmPassword,
  };
}

module.exports = { getNewUser };
