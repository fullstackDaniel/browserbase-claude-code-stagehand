# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Test-Driven Development (TDD) educational repository demonstrating Stagehand AI-powered testing vs traditional Playwright testing for a Color Mixer application. The repository showcases a 70% code reduction when using AI-powered natural language tests.

## Development Commands

### Initial Setup
```bash
# Navigate to my-app directory
cd my-app

# Install dependencies
npm install

# Create .env file with required API keys
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env

# Optional: Install Browserbase MCP for cloud testing
claude mcp add --scope project --transport stdio browserbase npx @browserbasehq/mcp-server-browserbase
```

### Running the Application
```bash
# Start development server (required for tests)
npm run dev  # App runs on http://localhost:3000
```

### Testing Commands
```bash
# Run all tests
npm run test

# Run specific test categories
npm run test tests/playwright           # All Playwright tests
npm run test tests/stagehand           # All Stagehand AI tests

# Run individual test files
npm run test tests/playwright/baseline.spec.ts
npm run test tests/playwright/color-mixer.spec.ts
npm run test tests/playwright/interactions.spec.ts
npm run test tests/stagehand/baseline-stagehand.spec.ts
npm run test tests/stagehand/color-workflows.spec.ts
npm run test tests/stagehand/interactions-stagehand.spec.ts

# Debug and development commands
npm run test:headed      # Run with visible browser
npm run test:debug       # Step-by-step debugging
npm run test:ui          # Playwright UI for interactive debugging

# Advanced test execution
npm run test -- --project=chromium     # Specific browser
npm run test -- --grep "color preview" # Pattern matching
npm run test -- --only-failures        # Re-run failures
npm run test -- --workers=4            # Parallel execution
```

## Repository Structure

```
browserbase-claude-code-stagehand/
├── my-app/
│   └── tests/
│       ├── playwright/         # Traditional selector-based tests
│       │   ├── baseline.spec.ts       # Element presence validation
│       │   ├── interactions.spec.ts   # User interaction tests
│       │   └── color-mixer.spec.ts    # Full workflow tests
│       └── stagehand/          # AI-powered natural language tests
│           ├── baseline-stagehand.spec.ts
│           ├── interactions-stagehand.spec.ts
│           └── color-workflows.spec.ts
└── CLAUDE.md
```

## TDD Methodology

Follow the Red → Green → Refactor cycle:

1. **RED Phase**: Write tests that fail (tests exist but app doesn't)
2. **GREEN Phase**: Implement minimal code to pass tests
   - Add required `data-testid` attributes
   - Implement color calculation logic
   - Add event handlers for sliders and buttons
3. **REFACTOR Phase**: Optimize while keeping tests green
   - Performance (<16ms updates)
   - Accessibility improvements

## Stagehand vs Playwright Patterns

### Playwright (Traditional)
```typescript
const redSlider = page.locator('[data-testid="slider-r"]')
await redSlider.fill('255')
const preview = page.locator('[data-testid="color-preview"] div')
const style = await preview.getAttribute('style')
expect(style).toContain('rgb(255,')
```

### Stagehand (AI-Powered)
```typescript
await stagehand.page.act('Set red color to maximum')
const result = await stagehand.page.extract({
  instruction: "Get current color values",
  schema: z.object({ hexValue: z.string() })
})
expect(result.hexValue).toBe('#FF0000')
```

## Key Stagehand API

- **stagehand.page.act()** - Natural language actions
- **stagehand.page.observe()** - Query page state
- **stagehand.page.extract()** - Extract structured data with Zod schemas

## Application Requirements

The Color Mixer app being tested includes:
- RGB sliders (0-255 range) with live preview
- Hex and RGB value display
- 6 color presets (Red, Green, Blue, Yellow, Black, White)
- Copy to clipboard functionality
- <16ms response time requirement
- Proper accessibility attributes

## Environment Variables

```bash
# Required for Stagehand tests
OPENAI_API_KEY=your_key_here

# Optional for cloud testing
BROWSERBASE_API_KEY=your_key_here
BROWSERBASE_PROJECT_ID=your_project_id
```