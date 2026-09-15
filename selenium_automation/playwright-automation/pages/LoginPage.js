class LoginPage {
	constructor(page) {
		this.page = page;
		this.usernameInput = page.locator("xpath=//input[@id='email']");
		this.passwordInput = page.locator("xpath=//input[@id='password']");
		this.loginButton = page.locator("xpath=//button[@type='submit']");
	}

	async open() {
		
	}

	async login(username, password) {
		await this.usernameInput.fill(username);
		await this.passwordInput.fill(password);
		await this.loginButton.click();
	}
}

module.exports = { LoginPage };
