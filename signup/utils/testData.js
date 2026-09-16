function uniqueSuffix() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function getNewUser() {
  const suffix = uniqueSuffix();
  return {
    fullName: process.env.TEST_FULL_NAME || `QA Test ${suffix}`,
    email: process.env.TEST_EMAIL || `qa.${suffix}@quokkalabs.com`,
    companyName: process.env.TEST_COMPANY_NAME || `Quokka Labs ${suffix}`,
    designation: process.env.TEST_DESIGNATION || 'QA Engineer',
    password: process.env.TEST_PASSWORD || `Qa@${suffix}1`,
  };
}

module.exports = { getNewUser };
