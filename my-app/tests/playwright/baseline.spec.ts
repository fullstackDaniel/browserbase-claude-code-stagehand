import { test, expect } from '@playwright/test'

/**
 * Baseline Tests - Simple Color Mixer Application
 * 
 * These tests verify basic structure and presence of UI elements.
 * Following TDD principles - tests should FAIL initially before implementation.
 */

test.describe('Color Mixer Baseline Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/')
  })

  test('app loads and displays title', async ({ page }) => {
    // Test that the main heading is visible
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('h1')).toContainText('Color Mixer')
    
    // Test that the subtitle/description is present
    await expect(page.locator('p')).toContainText('Mix and match colors with RGB sliders')
  })

  test('color preview element exists', async ({ page }) => {
    // Test that the main color preview card is visible
    const colorPreview = page.locator('[data-testid="color-preview"]')
    await expect(colorPreview).toBeVisible()
    
    // Test that it has a colored background (should have style attribute)
    await expect(colorPreview.locator('div')).toHaveAttribute('style', /background-color/)
    
    // Test that it has proper aria label for accessibility
    await expect(colorPreview.locator('div')).toHaveAttribute('aria-label', /Color preview/)
  })

  test('all three RGB sliders exist', async ({ page }) => {
    // Test that RGB controls container exists
    const rgbControls = page.locator('[data-testid="rgb-controls"]')
    await expect(rgbControls).toBeVisible()
    
    // Test that each slider exists with proper data-testid
    await expect(page.locator('[data-testid="slider-r"]')).toBeVisible()
    await expect(page.locator('[data-testid="slider-g"]')).toBeVisible() 
    await expect(page.locator('[data-testid="slider-b"]')).toBeVisible()
    
    // Test that slider labels are present
    await expect(page.locator('[data-testid="label-r"]')).toBeVisible()
    await expect(page.locator('[data-testid="label-g"]')).toBeVisible()
    await expect(page.locator('[data-testid="label-b"]')).toBeVisible()
  })

  test('hex and RGB values are displayed', async ({ page }) => {
    // Test that color values container exists
    const colorValues = page.locator('[data-testid="color-values"]')
    await expect(colorValues).toBeVisible()
    
    // Test that HEX value badge exists and shows format
    const hexValue = page.locator('[data-testid="hex-value"]')
    await expect(hexValue).toBeVisible()
    await expect(hexValue).toContainText('HEX: #')
    
    // Test that RGB value badge exists and shows format
    const rgbValue = page.locator('[data-testid="rgb-value"]')
    await expect(rgbValue).toBeVisible()
    await expect(rgbValue).toContainText('RGB: rgb(')
  })

  test('six color preset buttons exist', async ({ page }) => {
    // Test that preset grid container exists
    const presetGrid = page.locator('[data-testid="preset-grid"]')
    await expect(presetGrid).toBeVisible()
    
    // Test that all 6 preset buttons exist with proper data-testids
    await expect(page.locator('[data-testid="preset-red"]')).toBeVisible()
    await expect(page.locator('[data-testid="preset-green"]')).toBeVisible()
    await expect(page.locator('[data-testid="preset-blue"]')).toBeVisible()
    await expect(page.locator('[data-testid="preset-yellow"]')).toBeVisible()
    await expect(page.locator('[data-testid="preset-black"]')).toBeVisible()
    await expect(page.locator('[data-testid="preset-white"]')).toBeVisible()
    
    // Test that each preset button has a color indicator dot
    await expect(presetGrid.locator('span').first()).toBeVisible()
  })

  test('UI elements have proper accessibility attributes', async ({ page }) => {
    // Test that main heading has proper hierarchy
    await expect(page.locator('h1')).toBeVisible()
    
    // Test that sliders have labels associated
    await expect(page.locator('label[for]').or(page.locator('label')).first()).toBeVisible()
    
    // Test that clickable elements are properly marked
    const hexBadge = page.locator('[data-testid="hex-value"]')
    await expect(hexBadge).toHaveClass(/cursor-pointer/)
    
    const rgbBadge = page.locator('[data-testid="rgb-value"]')
    await expect(rgbBadge).toHaveClass(/cursor-pointer/)
  })

  test('page has proper responsive layout', async ({ page }) => {
    // Test that main container has max width constraint
    const mainContainer = page.locator('.max-w-2xl')
    await expect(mainContainer).toBeVisible()
    
    // Test that cards are properly structured
    const cards = page.locator('[class*="Card"]').or(page.locator('.card')).or(page.locator('div').filter({ hasText: /Color preview|RGB|Color Presets/ }))
    await expect(cards.first()).toBeVisible()
    
    // Test that grid layout exists for presets
    const presetGrid = page.locator('[data-testid="preset-grid"]')
    await expect(presetGrid).toHaveClass(/grid/)
  })
})