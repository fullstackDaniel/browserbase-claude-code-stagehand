import { test, expect } from '@playwright/test'
import { Stagehand } from '@browserbasehq/stagehand'
import { z } from 'zod'

/**
 * Baseline Stagehand Tests - Simple Color Mixer Application
 * 
 * These tests demonstrate AI-powered element discovery vs data-testid selectors.
 * Showcases more maintainable and readable test code using natural language.
 */

test.describe('Color Mixer Baseline Tests - Stagehand', () => {
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

  test('app loads and displays title using AI element discovery', async () => {
    // ✨ Stagehand: Use natural language to find elements
    // Instead of: page.locator('h1')
    const titleInfo = await stagehand.page.extract({
      instruction: "Get the main heading text and subtitle/description from the color mixer page",
      schema: z.object({
        mainTitle: z.string().describe("The main heading text"),
        description: z.string().describe("The subtitle or description text")
      })
    })
    
    expect(titleInfo.mainTitle).toContain('Color Mixer')
    expect(titleInfo.description).toContain('Mix and match colors with RGB sliders')
  })

  test('all three RGB sliders exist using AI discovery', async () => {
    const sliderInfo = await stagehand.page.extract({
      instruction: "Describe the RGB color sliders, including their labels (Red, Green, Blue), if they are visible and their current values.",
      schema: z.object({
        redSlider: z.string().describe("Description of the Red slider and its label in the form: Label: <label>, Visible: <true/false>, Value: <value>"),
        greenSlider: z.string().describe("Description of the Green slider and its label in the form: Label: <label>, Visible: <true/false>, Value: <value>"),
        blueSlider: z.string().describe("Description of the Blue slider and its label in the form: Label: <label>, Visible: <true/false>, Value: <value>"),
      })
    })
    expect(sliderInfo.redSlider).toContain('Label: Red');
    expect(sliderInfo.redSlider).toContain('Visible: true');
    expect(sliderInfo.redSlider).toContain('Value: 255');

    expect(sliderInfo.greenSlider).toContain('Label: Green');
    expect(sliderInfo.greenSlider).toContain('Visible: true');
    expect(sliderInfo.greenSlider).toContain('Value: 87');

    expect(sliderInfo.blueSlider).toContain('Label: Blue');
    expect(sliderInfo.blueSlider).toContain('Visible: true');
    expect(sliderInfo.blueSlider).toContain('Value: 51');
      
  })


  test('discover all RGB sliders using observe() for interaction', async () => {
    // ✨ observe() finds ELEMENTS you can interact with (vs extract() which gets data)
    const sliders = await stagehand.page.observe({
      instruction: 'Find all three RGB color sliders (Red, Green, Blue)'
    })
    
    // Returns array of elements with selectors and methods
    expect(sliders.length).toBe(3)
    
    // Verify we found all three sliders by their descriptions
    const hasRed = sliders.some(s => s.description.toLowerCase().includes('red'))
    const hasGreen = sliders.some(s => s.description.toLowerCase().includes('green'))
    const hasBlue = sliders.some(s => s.description.toLowerCase().includes('blue'))
    
    expect(hasRed).toBe(true)
    expect(hasGreen).toBe(true)
    expect(hasBlue).toBe(true)
  })

  test('hex and RGB values are displayed using AI discovery', async () => {
    const colorValueInfo = await stagehand.page.extract({
      instruction: "Get the displayed HEX and RGB color values.",
      schema: z.object({
        hexValue: z.string().describe("The displayed HEX color value (e.g., #RRGGBB)."),
        rgbValue: z.string().describe("The displayed RGB color value (e.g., rgb(R, G, B))."),
      })
    })
    expect(colorValueInfo.hexValue).toMatch(/^#([0-9A-F]{6})$/)
    expect(colorValueInfo.rgbValue).toMatch(/^rgb\((\d{1,3}, ){2}\d{1,3}\)$/)
  })

  test('six color preset buttons exist using AI discovery', async () => {
    const presetInfo = await stagehand.page.extract({
      instruction: "Describe the six color preset buttons (Red, Green, Blue, Yellow, Black, White) and confirm their visibility.",
      schema: z.object({
        redPreset: z.string().describe("Description of the Red preset button."),
        greenPreset: z.string().describe("Description of the Green preset button."),
        bluePreset: z.string().describe("Description of the Blue preset button."),
        yellowPreset: z.string().describe("Description of the Yellow preset button."),
        blackPreset: z.string().describe("Description of the Black preset button."),
        whitePreset: z.string().describe("Description of the White preset button."),
      })
    })
    expect(presetInfo.redPreset).toContain('Red preset')
    expect(presetInfo.greenPreset).toContain('Green preset')
    expect(presetInfo.bluePreset).toContain('Blue preset')
    expect(presetInfo.yellowPreset).toContain('Yellow preset')
    expect(presetInfo.blackPreset).toContain('Black preset')
    expect(presetInfo.whitePreset).toContain('White preset')
  })
})