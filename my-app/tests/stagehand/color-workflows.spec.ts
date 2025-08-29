import { test, expect } from '@playwright/test'
import { Stagehand } from '@browserbasehq/stagehand'
import { z } from 'zod'

/**
 * Stagehand AI Tests - Simple Color Mixer Application
 * 
 * These tests use natural language automation to test color mixing workflows.
 * Demonstrates ~70% code reduction compared to traditional Playwright tests.
 * Following TDD principles - tests should FAIL initially before implementation.
 */

test.describe('Color Mixer AI Workflows', () => {
  let stagehand: Stagehand
  
  test.beforeAll(async () => {
    // Verify environment variables
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY not found. Stagehand tests will fail.')
    }
  })

  test.beforeEach(async () => {
    // Initialize Stagehand with LOCAL mode for development
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

  test('user creates warm colors through natural interaction', async () => {
    // Natural language makes intent clear - no need to figure out specific RGB values
    await stagehand.page.act('Make the color warmer by increasing red and yellow tones')
    await stagehand.page.act('Adjust the color to look like a sunset')
    
    // Observe the current state
    const warmth = await stagehand.page.extract({
      instruction: 'Analyze if the current color appears warm (orange/red tones)',
      schema: z.object({
        isWarm: z.boolean(),
        dominantColor: z.string().describe('The main color family (red, orange, yellow, etc.)'),
        hexValue: z.string(),
      }),
    })
    
    expect(warmth.isWarm).toBe(true)
    expect(['red', 'orange', 'yellow']).toContain(warmth.dominantColor.toLowerCase())
  })

  test('user explores color presets efficiently', async () => {
    // Test each preset with natural language - no need for data-testid selectors
    await stagehand.page.act('Click on the red color preset')
    
    let currentColor = await stagehand.page.extract({
      instruction: 'What color is currently selected?',
      schema: z.object({
        colorName: z.string(),
        hexValue: z.string(),
      }),
    })
    
    expect(currentColor.colorName.toLowerCase()).toContain('red')
    expect(currentColor.hexValue).toBe('#FF0000')
    
    await stagehand.page.act('Now select the blue preset')
    
    currentColor = await stagehand.page.extract({
      instruction: 'What color is currently selected?', 
      schema: z.object({
        colorName: z.string(),
        hexValue: z.string(),
      }),
    })
    
    expect(currentColor.colorName.toLowerCase()).toContain('blue')
    expect(currentColor.hexValue).toBe('#0000FF')
  })

  test('user validates accessibility and usability', async () => {
    // AI can assess usability aspects that are hard to test with traditional methods
    const usabilityAssessment = await stagehand.page.extract({
      instruction: 'Evaluate the color picker for usability: are controls clearly labeled, is feedback clear, are colors easy to distinguish?',
      schema: z.object({
        controlsAreLabeled: z.boolean(),
        feedbackIsClear: z.boolean(),
        colorsAreDistinguishable: z.boolean(),
        overallUsability: z.number().min(1).max(10).describe('Overall usability score 1-10'),
        suggestions: z.array(z.string()).describe('Any suggestions for improvement'),
      }),
    })
    
    expect(usabilityAssessment.controlsAreLabeled).toBe(true)
    expect(usabilityAssessment.feedbackIsClear).toBe(true)
    expect(usabilityAssessment.overallUsability).toBeGreaterThanOrEqual(7)
  })

  test('preset buttons maintain visibility in dark mode', async () => {
    // Force dark mode to test the contrast issue  
    await stagehand.page.emulateMedia({ colorScheme: 'dark' })
    
    // Wait for dark mode to apply
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // First, try to specifically click on the Black button's text
    // This should fail if the text is invisible
    let blackButtonClickable = false
    try {
      await stagehand.page.act({
        action: 'Click on the text "Black" on the Black preset button (not just the button, but specifically the text label)'
      })
      blackButtonClickable = true
    } catch (error) {
      blackButtonClickable = false
    }
    
    // Use Stagehand's natural language to check button visibility
    const buttonVisibility = await stagehand.page.extract({
      instruction: 'Look at the 6 color preset buttons in the "Color Presets" section. For each button, can you clearly see and read the text label? Check if "Black" text is visible on the black button background. List any buttons where the text is hard to see or invisible due to poor contrast.',
      schema: z.object({
        allTextReadable: z.boolean().describe('Can you read ALL button labels clearly?'),
        problematicButtons: z.array(z.string()).describe('Which buttons have text that is hard to see or invisible?'),
        blackButtonTextVisible: z.boolean().describe('Specifically, can you see the "Black" text on the black button?'),
        contrastIssues: z.string().describe('Describe any contrast issues you observe'),
      }),
    })
    
    // Try to observe the Black button specifically
    const blackButtonObservation = await stagehand.page.observe({
      instruction: 'Find the button with "Black" text label in the Color Presets section. Can you clearly see the word "Black" written on it, or is the text invisible/very hard to see against the button background?'
    })
    
    // Test should FAIL if using bg-background (text invisible)
    // Test should PASS if using explicit colors (text visible)
    expect(blackButtonClickable).toBe(true) // Should be able to click the text
    expect(buttonVisibility.blackButtonTextVisible).toBe(true)
    expect(buttonVisibility.allTextReadable).toBe(true)
    expect(buttonVisibility.problematicButtons).toHaveLength(0)
    
    // The Black button should be observable
    expect(blackButtonObservation).toBeDefined()
    expect(blackButtonObservation.length).toBeGreaterThan(0)
  })
})