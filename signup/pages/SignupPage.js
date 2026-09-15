class SignupPage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.getByLabel(/first name/i);
    this.lastNameInput = page.getByLabel(/last name/i);
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/^password$/i);
    this.confirmPasswordInput = page.getByLabel(/confirm password|repeat password/i);
    this.signupButton = page.getByRole('button', { name: /sign up|create account|register/i });
  }

  async open() {
    await this.page.goto('/signup');
  }

  async signup(user) {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.confirmPasswordInput.fill(user.confirmPassword);
    await this.signupButton.click();
  }
}

module.exports = { SignupPage };
