class SignupPage {
  constructor(page) {
    this.page = page;
    this.fullNameInput = page.locator("#fullName");
    this.emailInput = page.locator("#email");
    this.companyNameInput = page.locator("#companyName");
    this.designationInput = page.locator("#designation");
    this.passwordInput = page.locator("#password");
    this.continueButton = page.locator("button[type='submit']");
  }

  async open() {
    await this.page.goto('/signup');
  }

  async signup(user) {
    await this.fullNameInput.fill(user.fullName);
    await this.emailInput.fill(user.email);
    await this.companyNameInput.fill(user.companyName);
    await this.designationInput.fill(user.designation);
    await this.passwordInput.fill(user.password);
    await this.continueButton.click();
  }
}

module.exports = { SignupPage };
