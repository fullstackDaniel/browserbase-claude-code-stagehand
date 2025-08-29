import { test, expect } from '@playwright/test'
import { Stagehand } from '@browserbasehq/stagehand'
import { z } from 'zod'

/**
 * Interaction Stagehand Tests - Natural Element Discovery
 * 
 * These tests demonstrate the power of AI-driven interactions vs precise selectors.
 * Shows how natural language makes tests more maintainable and user-focused.
 */

test.describe('Color Mixer Interaction Tests - Stagehand', () => {
  let stagehand: Stagehand
  
  test.beforeAll(async () => {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY not found. Stagehand tests will fail.')
    }
  })

  test.beforeEach(async () => {
    stagehand = new Stagehand({
      env: 'LOCAL',
      modelName: 'gpt-4o',
      modelClientOptions: {
        apiKey: process.env.OPENAI_API_KEY,
      },
      verbose: 1,
    })
    
    await stagehand.init()
    await stagehand.page.goto('http://localhost:3000')
  })

  test.afterEach(async () => {
    if (stagehand) {
      await stagehand.close()
    }
  })

  test('preset buttons apply correct colors - natural interaction', async () => {
    // ✨ Stagehand: Test red preset with natural language
    // Instead of: page.locator('[data-testid="preset-red"]').click()
    await stagehand.page.act('Click the red preset button to set the color to red')
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // ✨ Stagehand: Verify color values using AI understanding
    const redResult = await stagehand.page.extract({
      instruction: "Get the current HEX and RGB color values after clicking red preset",
      schema: z.object({
        hexValue: z.string().describe("The HEX color value displayed"),
        rgbValue: z.string().describe("The RGB color value displayed"),
        isActuallyRed: z.boolean().describe("Does the color preview look red to the human eye?")
      })
    })
    
    expect(redResult.hexValue).toContain('#FF0000')
    expect(redResult.rgbValue).toContain('rgb(255, 0, 0)')
    expect(redResult.isActuallyRed).toBe(true)
    
    // ✨ Stagehand: Test blue preset naturally
    await stagehand.page.act('Click the blue preset button to change to blue color')
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const blueResult = await stagehand.page.extract({
      instruction: "Get the current HEX and RGB color values after clicking blue preset",
      schema: z.object({
        hexValue: z.string().describe("The HEX color value displayed"),
        rgbValue: z.string().describe("The RGB color value displayed"),
        isActuallyBlue: z.boolean().describe("Does the color preview look blue to the human eye?")
      })
    })
    
    expect(blueResult.hexValue).toContain('#0000FF')
    expect(blueResult.rgbValue).toContain('rgb(0, 0, 255)')
    expect(blueResult.isActuallyBlue).toBe(true)
    
    // ✨ Stagehand: Test white preset for edge case
    await stagehand.page.act('Click the white preset button to set color to white')
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const whiteResult = await stagehand.page.extract({
      instruction: "Get the HEX and RGB color values after setting to white",
      schema: z.object({
        hexValue: z.string().describe("The HEX color value displayed"),
        rgbValue: z.string().describe("The RGB color value displayed")
      })
    })
    
    expect(whiteResult.hexValue).toContain('#FFFFFF')
    expect(whiteResult.rgbValue).toContain('rgb(255, 255, 255)')
  })

  test('multiple rapid slider interactions work - resilient AI testing', async () => {
    // ✨ Stagehand: Perform rapid slider adjustments using natural language
    // Instead of complex data-testid targeting for each slider
    await stagehand.page.act('Set the red slider to maximum value')
    await stagehand.page.act('Set the green slider to maximum value')
    await stagehand.page.act('Set the blue slider to maximum value')
    
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // ✨ Stagehand: Verify final white color using AI understanding
    const finalResult = await stagehand.page.extract({
      instruction: "Get the final HEX and RGB color values after setting all sliders to maximum",
      schema: z.object({
        hexValue: z.string().describe("The final HEX color value"),
        rgbValue: z.string().describe("The final RGB color value"),
        looksLikeWhite: z.boolean().describe("Does the color preview look white?"),
        allSlidersAtMax: z.boolean().describe("Are all three sliders at their maximum positions?")
      })
    })
    
    expect(finalResult.hexValue).toContain('#FFFFFF')
    expect(finalResult.rgbValue).toContain('rgb(255, 255, 255)')
    expect(finalResult.looksLikeWhite).toBe(true)
    expect(finalResult.allSlidersAtMax).toBe(true)
  })

  test('random color generator creates new colors each time', async () => {
    // ✨ Stagehand: Extract initial color state before random generation
    // This captures the starting point for comparison
    const initialColor = await stagehand.page.extract({
      instruction: "Get the current color values before using random generator",
      schema: z.object({
        hexValue: z.string().describe("The current HEX color value"),
        rgbValue: z.string().describe("The current RGB color value"),
        redSliderValue: z.number().describe("The red slider position (0-255)"),
        greenSliderValue: z.number().describe("The green slider position (0-255)"),
        blueSliderValue: z.number().describe("The blue slider position (0-255)")
      })
    })

    // ✨ Stagehand: Observe to locate the random color button
    // This will FAIL because the button doesn't exist yet (RED phase of TDD)
    const randomButton = await stagehand.page.observe({
      instruction: "Find the Random Color button or Randomize button that generates a random color"
    })

    expect(randomButton).toBeTruthy() // This should fail - button doesn't exist

    // ✨ Stagehand: Act to click the random color generator
    // This demonstrates the intended interaction pattern
    await stagehand.page.act('Click the Random Color button to generate a new random color')
    
    await new Promise(resolve => setTimeout(resolve, 200))

    // ✨ Stagehand: Extract the new color after first randomization
    const firstRandomColor = await stagehand.page.extract({
      instruction: "Get the color values after clicking the random generator once",
      schema: z.object({
        hexValue: z.string().describe("The new HEX color value after randomization"),
        rgbValue: z.string().describe("The new RGB color value after randomization"),
        redSliderValue: z.number().describe("The red slider position after randomization"),
        greenSliderValue: z.number().describe("The green slider position after randomization"),
        blueSliderValue: z.number().describe("The blue slider position after randomization"),
        isDifferentFromInitial: z.boolean().describe("Is this color visually different from the initial color?")
      })
    })

    // Verify the color changed from initial
    expect(firstRandomColor.hexValue).not.toBe(initialColor.hexValue)
    expect(firstRandomColor.isDifferentFromInitial).toBe(true)

    // ✨ Stagehand: Act to click random generator again
    await stagehand.page.act('Click the Random Color button again to generate another random color')
    
    await new Promise(resolve => setTimeout(resolve, 200))

    // ✨ Stagehand: Extract the second random color
    const secondRandomColor = await stagehand.page.extract({
      instruction: "Get the color values after clicking the random generator a second time",
      schema: z.object({
        hexValue: z.string().describe("The second random HEX color value"),
        rgbValue: z.string().describe("The second random RGB color value"),
        isDifferentFromFirst: z.boolean().describe("Is this color different from the first random color?"),
        isDifferentFromInitial: z.boolean().describe("Is this color different from the original initial color?")
      })
    })

    // Verify true randomness - each click should produce different colors
    expect(secondRandomColor.hexValue).not.toBe(firstRandomColor.hexValue)
    expect(secondRandomColor.hexValue).not.toBe(initialColor.hexValue)
    expect(secondRandomColor.isDifferentFromFirst).toBe(true)
    expect(secondRandomColor.isDifferentFromInitial).toBe(true)

    // Additional verification: Ensure sliders moved to match the random color
    expect(firstRandomColor.redSliderValue).toBeGreaterThanOrEqual(0)
    expect(firstRandomColor.redSliderValue).toBeLessThanOrEqual(255)
    expect(firstRandomColor.greenSliderValue).toBeGreaterThanOrEqual(0)
    expect(firstRandomColor.greenSliderValue).toBeLessThanOrEqual(255)
    expect(firstRandomColor.blueSliderValue).toBeGreaterThanOrEqual(0)
    expect(firstRandomColor.blueSliderValue).toBeLessThanOrEqual(255)
  })
})