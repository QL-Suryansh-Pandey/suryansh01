let users = {};
try {
  users = require('../test-data/users.json');
} catch {
  // Fixture is gitignored; env vars take over when it's absent.
}

function getValidUser() {
  return {
    username: process.env.TEST_USERNAME || users.validUser?.username,
    password: process.env.TEST_PASSWORD || users.validUser?.password,
  };
}

module.exports = { getValidUser };
