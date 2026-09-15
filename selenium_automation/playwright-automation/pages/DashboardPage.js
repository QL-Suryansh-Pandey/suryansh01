class DashboardPage {
	constructor(page) {
		this.page = page;
		this.heading = page.getByRole('heading', { name: /dashboard|home/i });
		this.logoutButton = page.getByRole('button', { name: /log ?out|sign out/i });
	}

	async expectLoaded() {
		await this.heading.waitFor();
	}

	async logout() {
		await this.logoutButton.click();
	}
}

module.exports = { DashboardPage };
