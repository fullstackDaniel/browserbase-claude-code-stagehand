import { test, expect } from '@playwright/test'

/**
 * Interaction Tests - Simple Color Mixer Application
 * 
 * These tests verify user interactions and dynamic behavior.
 * Following TDD principles - tests should FAIL initially before implementation.
 */

test.describe('Color Mixer Interaction Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('RGB slider changes update color preview', async ({ page }) => {
    // Get initial color preview background
    const colorPreview = page.locator('[data-testid="color-preview"] div').first()
    const initialStyle = await colorPreview.getAttribute('style')
    
    // Change red slider to maximum (255)
    const redSlider = page.locator('[data-testid="slider-r"]')
    await redSlider.click()
    
    // Use keyboard to set value (more reliable than drag)
    await page.keyboard.press('End') // Move to max value
    
    // Wait for color update (should be <16ms but give some buffer)
    await page.waitForTimeout(50)
    
    // Verify color preview updated
    const updatedStyle = await colorPreview.getAttribute('style')
    expect(updatedStyle).not.toBe(initialStyle)
    
    // Verify background color contains high red value
    expect(updatedStyle).toMatch(/background-color.*rgb\(255/)
  })

  test('preset buttons apply correct colors', async ({ page }) => {
    // Test red preset
    await page.locator('[data-testid="preset-red"]').click()
    
    // Wait for update
    await page.waitForTimeout(50)
    
    // Check hex value shows red
    const hexValue = page.locator('[data-testid="hex-value"]')
    await expect(hexValue).toContainText('#FF0000')
    
    // Check RGB value shows red
    const rgbValue = page.locator('[data-testid="rgb-value"]')
    await expect(rgbValue).toContainText('rgb(255, 0, 0)')
    
    // Test blue preset
    await page.locator('[data-testid="preset-blue"]').click()
    await page.waitForTimeout(50)
    
    await expect(hexValue).toContainText('#0000FF')
    await expect(rgbValue).toContainText('rgb(0, 0, 255)')
    
    // Test white preset  
    await page.locator('[data-testid="preset-white"]').click()
    await page.waitForTimeout(50)
    
    await expect(hexValue).toContainText('#FFFFFF')
    await expect(rgbValue).toContainText('rgb(255, 255, 255)')
  })

  test('copy button triggers clipboard action', async ({ page }) => {
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-write'])
    
    // Click hex value to copy
    await page.locator('[data-testid="hex-value"]').click()
    
    // Wait for clipboard operation
    await page.waitForTimeout(100)
    
    // Check if toast appears (testing UI feedback)
    // Note: Toast component should be visible temporarily
    const toast = page.locator('text=Copied:').or(page.locator('[role="alert"]')).or(page.locator('.toast'))
    await expect(toast.first()).toBeVisible({ timeout: 1000 })
    
    // Test RGB value copy as well
    await page.locator('[data-testid="rgb-value"]').click()
    await page.waitForTimeout(100)
    
    // Toast should appear again
    await expect(toast.first()).toBeVisible({ timeout: 1000 })
  })

  test('numeric values update correctly with slider changes', async ({ page }) => {
    // Test red channel
    const redSlider = page.locator('[data-testid="slider-r"]')
    await redSlider.click()
    await page.keyboard.press('End') // Maximum value
    await page.waitForTimeout(50)
    
    // Check that red numeric display shows 255
    const redValue = page.locator('[data-testid="value-r"]')
    await expect(redValue).toContainText('255')
    
    // Test green channel
    const greenSlider = page.locator('[data-testid="slider-g"]')
    await greenSlider.click()
    await page.keyboard.press('Home') // Minimum value
    await page.waitForTimeout(50)
    
    // Check that green numeric display shows 0
    const greenValue = page.locator('[data-testid="value-g"]')
    await expect(greenValue).toContainText('0')
    
    // Verify hex value updated accordingly (red=255, green=0)
    const hexValue = page.locator('[data-testid="hex-value"]')
    await expect(hexValue).toContainText('#FF00')
  })

  test('multiple rapid slider interactions work correctly', async ({ page }) => {
    // Test rapid slider movements don't cause issues
    const redSlider = page.locator('[data-testid="slider-r"]')
    const greenSlider = page.locator('[data-testid="slider-g"]') 
    const blueSlider = page.locator('[data-testid="slider-b"]')
    
    // Rapid interactions
    await redSlider.click()
    await page.keyboard.press('End')
    await greenSlider.click() 
    await page.keyboard.press('End')
    await blueSlider.click()
    await page.keyboard.press('End')
    
    await page.waitForTimeout(100)
    
    // Should result in white color
    await expect(page.locator('[data-testid="hex-value"]')).toContainText('#FFFFFF')
    await expect(page.locator('[data-testid="rgb-value"]')).toContainText('rgb(255, 255, 255)')
  })

  test('preset button interactions work with visual feedback', async ({ page }) => {
    // Test that preset buttons have proper hover/click states
    const redPreset = page.locator('[data-testid="preset-red"]')
    
    // Test hover effect (scale transformation)
    await redPreset.hover()
    await expect(redPreset).toHaveClass(/hover:scale-105/)
    
    // Test click and color change
    await redPreset.click()
    await page.waitForTimeout(50)
    
    // Verify color changed to red
    const colorPreview = page.locator('[data-testid="color-preview"] div').first()
    const style = await colorPreview.getAttribute('style')
    expect(style).toContain('rgb(255, 0, 0)')
  })

  test('edge cases: extreme slider values work correctly', async ({ page }) => {
    // Test minimum values (all 0)
    await page.locator('[data-testid="slider-r"]').click()
    await page.keyboard.press('Home')
    await page.locator('[data-testid="slider-g"]').click() 
    await page.keyboard.press('Home')
    await page.locator('[data-testid="slider-b"]').click()
    await page.keyboard.press('Home')
    
    await page.waitForTimeout(50)
    
    // Should be black
    await expect(page.locator('[data-testid="hex-value"]')).toContainText('#000000')
    await expect(page.locator('[data-testid="rgb-value"]')).toContainText('rgb(0, 0, 0)')
    
    // Test maximum values (all 255) 
    await page.locator('[data-testid="slider-r"]').click()
    await page.keyboard.press('End')
    await page.locator('[data-testid="slider-g"]').click()
    await page.keyboard.press('End') 
    await page.locator('[data-testid="slider-b"]').click()
    await page.keyboard.press('End')
    
    await page.waitForTimeout(50)
    
    // Should be white
    await expect(page.locator('[data-testid="hex-value"]')).toContainText('#FFFFFF')
    await expect(page.locator('[data-testid="rgb-value"]')).toContainText('rgb(255, 255, 255)')
  })
})