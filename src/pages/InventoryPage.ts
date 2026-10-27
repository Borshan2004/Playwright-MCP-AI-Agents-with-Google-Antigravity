import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly productCards: Locator;
  readonly title: Locator;
  readonly shoppingCartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.productCards = this.page.getByTestId('inventory-item');
    this.title = this.page.getByTestId('title');
    this.shoppingCartLink = this.page.getByTestId('shopping-cart-link');
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
    await this.waitForReady();
  }
}
