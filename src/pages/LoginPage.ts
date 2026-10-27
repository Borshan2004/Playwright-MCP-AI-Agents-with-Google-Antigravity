import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { InventoryPage } from './InventoryPage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = this.page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = this.page.getByRole('textbox', { name: 'Password' });
    this.loginButton = this.page.getByRole('button', { name: 'Login' });
    this.errorMessage = this.page.getByTestId('error');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.waitForReady();
  }

  async loginAs(user: { username: string; password?: string }): Promise<InventoryPage> {
    await this.usernameInput.fill(user.username);
    if (user.password !== undefined) {
      await this.passwordInput.fill(user.password);
    }
    await this.loginButton.click();
    return new InventoryPage(this.page);
  }
}
