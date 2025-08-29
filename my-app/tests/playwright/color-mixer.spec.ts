import { test, expect } from '@playwright/test'

test.describe('Color Mixer Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display color mixer with initial state', async ({ page }) => {
    // Check title is visible
    await expect(page.locator('h1')).toContainText('Color Mixer')
    
    // Check color preview exists
    const preview = page.locator('[data-testid="color-preview"]')
    await expect(preview).toBeVisible()
    
    // Check initial color values
    await expect(page.locator('[data-testid="hex-value"]')).toContainText('#FF5733')
    await expect(page.locator('[data-testid="rgb-value"]')).toContainText('rgb(255, 87, 51)')
    
    // Check RGB sliders exist
    await expect(page.locator('[data-testid="slider-r"]')).toBeVisible()
    await expect(page.locator('[data-testid="slider-g"]')).toBeVisible()
    await expect(page.locator('[data-testid="slider-b"]')).toBeVisible()
    
    // Check presets exist
    await expect(page.locator('[data-testid="preset-red"]')).toBeVisible()
    await expect(page.locator('[data-testid="preset-green"]')).toBeVisible()
    await expect(page.locator('[data-testid="preset-blue"]')).toBeVisible()
    await expect(page.locator('[data-testid="preset-yellow"]')).toBeVisible()
    await expect(page.locator('[data-testid="preset-black"]')).toBeVisible()
    await expect(page.locator('[data-testid="preset-white"]')).toBeVisible()
  })

  test('should update color when clicking presets', async ({ page }) => {
    // Click red preset
    await page.locator('[data-testid="preset-red"]').click()
    await expect(page.locator('[data-testid="hex-value"]')).toContainText('#FF0000')
    await expect(page.locator('[data-testid="rgb-value"]')).toContainText('rgb(255, 0, 0)')
    
    // Click blue preset
    await page.locator('[data-testid="preset-blue"]').click()
    await expect(page.locator('[data-testid="hex-value"]')).toContainText('#0000FF')
    await expect(page.locator('[data-testid="rgb-value"]')).toContainText('rgb(0, 0, 255)')
  })

  test('should copy color values to clipboard', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    
    // Click to copy hex value
    await page.locator('[data-testid="hex-value"]').click()
    
    // Wait for toast to appear
    await page.waitForTimeout(500)
    
    // Check clipboard content
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboardText).toBe('#FF5733')
  })
})