import { test, expect } from '@playwright/test';

test.describe('Kanban Board', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('http://localhost:3000');
  });

  test('should load the board successfully', async ({ page }) => {
    // Fill in the configuration
    await page.locator('[data-testid="workload-input"]').fill('pm: 1, dev: 4, qa: 1');
    await page.locator('[data-testid="workers-input"]').fill('pm, dev, dev, dev, dev, qa');
    await page.locator('[data-testid="stories-input"]').fill('200');
    
    // Click Run button
    await page.locator('[data-testid="run-button"]').click();
    
    // Check if the board container is visible
    await expect(page.locator('#board')).toBeVisible();
  });

  test('should have columns for different stages', async ({ page }) => {
    // Fill in the configuration
    await page.locator('[data-testid="workload-input"]').fill('pm: 1, dev: 4, qa: 1');
    await page.locator('[data-testid="workers-input"]').fill('pm, dev, dev, dev, dev, qa');
    await page.locator('[data-testid="stories-input"]').fill('200');
    
    // Click Run button
    await page.locator('[data-testid="run-button"]').click();
    
    // Wait for the board to be visible first
    await expect(page.locator('#board')).toBeVisible();
    
    // Then check if the basic columns exist
    await expect(page.locator('.col')).toHaveCount(12);
  });

  // test('should allow adding a new card', async ({ page }) => {
  //   // Click the add card button in the first column
  //   await page.locator('.column:first-child .add-card-button').click();
    
  //   // Fill in the card details
  //   await page.locator('input[name="title"]').fill('Test Card');
  //   await page.locator('textarea[name="description"]').fill('Test Description');
    
  //   // Submit the form
  //   await page.locator('button[type="submit"]').click();
    
  //   // Verify the card was added
  //   await expect(page.locator('.card').filter({ hasText: 'Test Card' })).toBeVisible();
  // });

  // test('should allow dragging cards between columns', async ({ page }) => {
  //   // First add a card
  //   await page.locator('.column:first-child .add-card-button').click();
  //   await page.locator('input[name="title"]').fill('Draggable Card');
  //   await page.locator('textarea[name="description"]').fill('Test Description');
  //   await page.locator('button[type="submit"]').click();
    
  //   // Get the card element
  //   const card = page.locator('.card').filter({ hasText: 'Draggable Card' });
    
  //   // Get the target column
  //   const targetColumn = page.locator('.column').nth(1); // Second column
    
  //   // Perform drag and drop
  //   await card.dragTo(targetColumn);
    
  //   // Verify the card is in the new column
  //   await expect(targetColumn.locator('.card').filter({ hasText: 'Draggable Card' })).toBeVisible();
  // });
}); 