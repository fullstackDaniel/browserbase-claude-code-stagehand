# PRD: Simple Color Mixer

## 1. Overview

**App Name**: Simple Color Mixer

**Purpose**:  
A **minimalist color mixing tool** built with TDD to demonstrate how Stagehand's AI-powered testing dramatically improves upon traditional Playwright tests.

**Key Distinction**:
- **The App**: Dead simple color mixer - no AI, just basic controls (~50 lines of React)
- **The Tests**: Sophisticated AI-powered testing that uses natural language instead of brittle selectors

---

## 2. Core Features (Intentionally Minimal)

### **A. RGB Sliders**
- Three sliders (Red: 0-255, Green: 0-255, Blue: 0-255)
- Live color preview box
- Hex value display (#FF5733)
- RGB value display (255, 87, 51)

### **B. Color Presets**
- 6 preset buttons: Red, Blue, Green, Yellow, Black, White
- Click to instantly set color
- Visual feedback on selection

### **C. Copy to Clipboard**
- Button to copy hex value
- "Copied!" success feedback
- 2-second feedback timeout

That's it. No AI, no complex features, no color history, no harmony generation.

---

## 3. Why This Simple App Showcases Stagehand Perfectly

### **The Problem with Traditional Playwright Tests**
```typescript
// Brittle - breaks when implementation changes
await page.locator('#slider-red').fill('128');
await page.getByTestId('preset-blue').click();
await expect(page.locator('.hex-display')).toHaveText('#0000FF');
```

### **The Stagehand Advantage**
```typescript
// Resilient - works regardless of implementation
await page.act("set red to 128");
await page.act("click the blue preset");
const color = await page.observe("what's the current hex color?");
```

---

## 4. Progressive Test Examples

### **Test 1: Basic Interaction** 
**Playwright Pain:**
```typescript
const redSlider = page.locator('[data-testid="slider-red"]');
await redSlider.fill('255');
const hexDisplay = page.locator('.hex-value');
await expect(hexDisplay).toHaveText('#FF0000');
```

**Stagehand Simplicity:**
```typescript
await page.act("set the red slider to maximum");
const color = await page.observe("what color is displayed?");
expect(color).toContain("red");
```

**Win:** No selectors to maintain when UI changes

### **Test 2: Preset Discovery**
**Playwright Pain:**
```typescript
const presetButtons = await page.locator('[data-testid^="preset-"]').all();
for (const button of presetButtons) {
  const text = await button.textContent();
  // Parse and validate each button
}
```

**Stagehand Simplicity:**
```typescript
const presets = await page.observe("find all color preset buttons");
await page.act("click the blue color preset");
```

**Win:** Dynamically discovers UI elements without knowing structure

### **Test 3: Copy Functionality**
**Playwright Pain:**
```typescript
// Mock clipboard API
await page.evaluate(() => {
  navigator.clipboard.writeText = jest.fn();
});
await page.click('[data-testid="copy-button"]');
const feedback = page.locator('.copy-feedback');
await expect(feedback).toBeVisible();
```

**Stagehand Simplicity:**
```typescript
await page.act("copy the hex color");
const feedback = await page.observe("was the color copied successfully?");
```

**Win:** Tests user intent, not implementation details

### **Test 4: Data Extraction**
**Playwright Pain:**
```typescript
const hexText = await page.locator('.hex-display').textContent();
const rgbText = await page.locator('.rgb-display').textContent();
// Parse strings, extract numbers, handle formats...
```

**Stagehand Simplicity:**
```typescript
const colorData = await page.extract({
  instruction: "get the current color values",
  schema: z.object({
    hex: z.string(),
    rgb: z.object({ r: z.number(), g: z.number(), b: z.number() })
  })
});
```

**Win:** Structured data extraction without DOM parsing

---

## 5. Implementation Guidelines

### **Tech Stack**
- Next.js 15 with App Router
- shadcn/ui components (Slider, Button, Card)
- React useState only (no complex state management)
- Tailwind CSS

### **Code Simplicity**
- ~50-75 lines of React component code
- No external color libraries
- Simple RGB to Hex conversion
- Basic clipboard API usage

### **Color Presets** (Hardcoded)
```javascript
const PRESETS = {
  red: { r: 255, g: 0, b: 0 },
  blue: { r: 0, g: 0, b: 255 },
  green: { r: 0, g: 255, b: 0 },
  yellow: { r: 255, g: 255, b: 0 },
  black: { r: 0, g: 0, b: 0 },
  white: { r: 255, g: 255, b: 255 }
};
```

---

## 6. Testing Strategy (The Real Value)

### **Phase 1: Structure Tests (Playwright Baseline)**
Show traditional approach with data-testid attributes and specific selectors.

### **Phase 2: Interaction Tests (Stagehand act())**
Demonstrate natural language commands that survive UI refactors.

### **Phase 3: Discovery Tests (Stagehand observe())**
Show AI finding elements without knowing their implementation.

### **Phase 4: Data Tests (Stagehand extract())**
Extract structured data with schemas instead of parsing DOM.

### **The Compelling Story**
- **Developer Time**: Write tests 3x faster with natural language
- **Maintenance**: Tests survive complete UI redesigns
- **Readability**: Tests read like user stories, not jQuery
- **Coverage**: Test what matters (user intent) not how it's built

---

## 7. Success Metrics

### **App Success** (Takes 10 minutes to build)
- ✅ RGB sliders update color in real-time
- ✅ Presets work with one click
- ✅ Copy button provides feedback
- ✅ Clean, responsive UI

### **Testing Success** (The real demonstration)
- ✅ Stagehand tests are 70% shorter than Playwright
- ✅ Tests survive changing all IDs and classes
- ✅ Tests read like plain English
- ✅ New developers understand tests immediately

---

## 8. Why This Matters

**The Insight**: The simpler the app, the clearer the testing advantage.

With a basic color mixer, there's no confusion about app complexity. The entire focus shifts to the elegance of testing with AI. When a test says `act("make it blue")` instead of finding specific DOM elements, the value is immediately obvious.

**Bottom Line**: We're not building an AI app. We're demonstrating that AI-powered testing is the future of TDD - more maintainable, more readable, and more aligned with how humans think about software.

---

## 9. Cloud Testing with Browserbase MCP

**The MCP Integration**: The Browserbase MCP Server connects Claude (or other AI assistants) directly to Browserbase's cloud browser infrastructure. This means Claude can actually run and observe tests in real browsers through the MCP connection. Deploy the app to Vercel/Netlify, then use the MCP to have Claude execute Stagehand tests on real browsers in the cloud.

**How it Works**:
```typescript
// In .mcp.json - configure Browserbase MCP server
{
  "mcpServers": {
    "browserbase": {
      "command": "npx",
      "args": ["@browserbase/mcp-server-browserbase"],
      "env": {
        "BROWSERBASE_API_KEY": "your-key",
        "BROWSERBASE_PROJECT_ID": "your-project"
      }
    }
  }
}

// Claude can now run tests directly via MCP
// "Claude, run the color mixer tests on Browserbase"
// Claude executes: mcp.browserbase.runTest({
//   url: 'https://simple-color-mixer.vercel.app',
//   test: 'stagehand-color-test.js'
// })
```

**The Demo Power**: 
1. Build app locally with TDD
2. Deploy to public URL
3. Configure Browserbase MCP
4. Ask Claude to run the tests: "Run our Stagehand tests on Chrome, Firefox, and Safari simultaneously"
5. Claude uses MCP to execute tests on Browserbase infrastructure and reports results

**Why This Matters**: Shows the complete modern testing workflow - from local TDD with Stagehand to AI-orchestrated cloud testing via MCP. The AI doesn't just help write tests, it can run and monitor them in production.