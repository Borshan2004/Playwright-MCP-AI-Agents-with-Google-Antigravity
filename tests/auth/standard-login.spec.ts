import { test, expect } from '../../src/fixtures/base';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import users from '../data/users.json';

test.describe('Standard user login', () => {
  test('lands on inventory with 6 products @smoke @critical', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    const inventory = await login.loginAs(users.standard);
    await expect(inventory.productCards).toHaveCount(6);
    await expect(inventory.title).toBeVisible();
    await expect(inventory.title).toHaveText('Products');
  });
});
