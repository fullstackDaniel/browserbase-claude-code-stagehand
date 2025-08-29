# Product Requirements: Simple Color Mixer

## Overview

A minimalist color mixing tool designed to demonstrate Test-Driven Development with AI-powered testing using Stagehand and traditional Playwright side-by-side.

## Core Features

### RGB Sliders

- Three sliders (Red, Green, Blue: 0-255 range)
- Live color preview updates
- Hex value display (#FF5733)
- RGB value display (rgb(255, 87, 51))

### Color Presets

- 6 preset buttons: Red, Blue, Green, Yellow, Black, White
- Instant color application on click

### Copy to Clipboard

- Copy current hex value
- Visual feedback on success

---

## Testing Comparison

### Traditional Playwright

```typescript
// Brittle - depends on specific selectors
const redSlider = page.locator('[data-testid="slider-r"]');
await redSlider.fill("255");
const preview = page.locator('[data-testid="color-preview"]');
await expect(preview).toHaveCSS("background-color", "rgb(255, 0, 0)");
```

### Stagehand AI-Powered

```typescript
// Resilient - uses natural language
await stagehand.page.act("Set the red color to maximum");
const result = await stagehand.page.extract({
  instruction: "Get current color values",
  schema: z.object({ hexValue: z.string() }),
});
expect(result.hexValue).toBe("#FF0000");
```

---

## Key Testing Advantages

### Less Code

- Playwright: ~150 lines per test file
- Stagehand: ~50 lines for same coverage

### Natural Language vs Selectors

```typescript
// Instead of finding elements:
page.locator('[data-testid="preset-red"]').click();

// Use intent:
stagehand.page.act("Click the red preset button");
```

### Structured Data Extraction

```typescript
// Extract with schema validation:
const colorData = await stagehand.page.extract({
  instruction: "Get current color values",
  schema: z.object({
    hexValue: z.string(),
    rgbValue: z.string(),
    isActuallyRed: z.boolean(),
  }),
});
```

---

## Tech Stack

- Next.js with App Router
- shadcn/ui components
- React useState
- Tailwind CSS

## TDD Testing Strategy

### 1. **Baseline Tests** - Structure validation

- Element presence
- Accessibility attributes
- Layout structure

### 2. **Interaction Tests** - User actions

- Slider manipulation
- Preset button clicks
- Copy functionality

### 3. **Workflow Tests** - Complex scenarios

- Color mixing sequences
- State persistence
- Edge cases

## Success Metrics

- ✅ **70% code reduction** with Stagehand
- ✅ **Tests survive UI refactors** without changes
- ✅ **Natural language** test descriptions
- ✅ **Faster test development** (3x improvement)

---

## Cloud Testing with Browserbase

### MCP Integration

```bash
# Install Browserbase MCP
claude mcp add --scope project --transport stdio \
  browserbase npx @browserbasehq/mcp-server-browserbase
```

### Test Execution Modes

```typescript
// Local development
const stagehand = new Stagehand({ env: "LOCAL" });

// Cloud testing
const stagehand = new Stagehand({
  env: "BROWSERBASE",
  apiKey: process.env.BROWSERBASE_API_KEY,
});
```
