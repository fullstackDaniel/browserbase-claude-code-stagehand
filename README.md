# Episode 9: Test-Driven Development with Stagehand & Browserbase

**🤖 Sponsored by Browserbase**: Sign up today ► https://browserbase.plug.dev/ekNRhob

**🎥 Watch the Episode**: [How to Reduce 90% of Errors with Claude Code](https://www.youtube.com/watch?v=5jPQNDu_iJA)

Learn how to reduce 90% of errors using Test-Driven Development with AI-powered testing. This repository contains free resources from Episode 9 where we build a Color Mixer app using TDD methodology with Stagehand's natural language testing framework.

## 📦 Repository Structure

```
browserbase-claude-code-stagehand/
├── README.md                          # This file
├── CLAUDE.md                          # Claude Code guidance file
├── .claude/                           # Claude Code configuration
│   ├── agents/                        # AI agent definitions
│   │   └── stagehand-expert.md       # Stagehand testing specialist agent
│   ├── commands/                      # Custom commands
│   │   └── agent_prompts/            # Agent prompt templates
│   │       └── stagehand_expert_prompt.md
│   └── output-styles/                 # Output formatting rules
│       └── pragmatic-test-driven-developer.md  # TDD enforcement style
└── my-app/
    └── tests/                         # Test suite implementations
        ├── README.md                  # Comprehensive test documentation
        ├── playwright/                # Traditional selector-based tests
        │   ├── baseline.spec.ts      # Basic structure & element presence
        │   ├── interactions.spec.ts  # User interactions & validations
        │   └── color-mixer.spec.ts   # Full workflow tests
        └── stagehand/                 # AI-powered natural language tests
            ├── baseline-stagehand.spec.ts      # AI element discovery
            ├── interactions-stagehand.spec.ts  # Natural language interactions
            └── color-workflows.spec.ts         # Complex AI workflows
```

### Resources to be Added:

- **prd/** - Product requirements for Color Mixer app
- **docs/** - Learning materials and guides
- **transcript/** - Episode materials and timestamps

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install Stagehand and Playwright
npm install --save-dev @browserbasehq/stagehand playwright

# Install Browserbase MCP (optional - for cloud testing)
claude mcp add --scope project --transport stdio browserbase npx @browserbasehq/mcp-server-browserbase
```

### 2. Try Natural Language Testing

```typescript
// Traditional Playwright (brittle)
await page.locator('[data-testid="slider-red"]').fill("255");

// Stagehand Natural Language (robust)
await page.act("set the red slider to maximum");
const color = await page.observe("what color is displayed?");
```

### 3. Run Example Tests

```bash
# Run Playwright tests
npx playwright test tests/playwright/

# Run Stagehand tests
npx playwright test tests/stagehand/
```

## 📚 What's Included (FREE)

### **Stagehand Expert Agent** (`agents/stagehand-expert.md`)

- Complete agent definition for AI-powered testing
- Pre-configured with Stagehand best practices
- Natural language test patterns and examples
- Works with Claude Code multi-agent workflows

### **TDD Output Style** (`output-styles/pragmatic-tdd-developer.md`)

- Enforces test-first development methodology
- Automatic Red → Green → Verify cycle
- Prevents skipping tests or writing untested code
- Compatible with all Claude Code agents

### **Color Mixer PRD** (`prd/simple-color-mixer.md`)

- Complete product requirements document
- Detailed feature specifications
- Test scenarios and success criteria
- Progressive complexity for learning TDD

### **Test Examples** (`tests/`)

- Working Playwright baseline tests
- Stagehand natural language conversions
- Side-by-side comparisons showing robustness
- Real-world patterns you can adapt

## 🎯 Want More?

### **For Claude Code Insiders (Free Membership)**

Join the AI Insiders Club for additional resources:

- Custom command structures (`/dev:design-app`, `/dev:implement-mvp`)
- Lesson outline with detailed timestamps
- Resource collection and reference links
- Early access to new episodes

**Join FREE** ► https://insiders.aioriented.dev

### **For Builder Pack Members (Premium)**

Get the complete implementation package:

- ✅ **Full Agent Team** (UI Designer, shadcn Expert, Orchestrator, TypeScript Specialist)
- ✅ **Complete Design Outputs** (wireframes, manifest, implementation plan)
- ✅ **Final Color Mixer Project** (working app with all tests)
- ✅ **Priority Support** in the community

**Get Builder Pack** ► https://rebrand.ly/q6toh81

## 🔧 TDD Methodology Overview

The Test-Driven Development cycle demonstrated in this episode:

```
1. RED PHASE (Write Test)
   └── Write test for desired functionality
   └── Run test to confirm it fails
   └── State: "❌ Test written and failing"

2. GREEN PHASE (Implement Code)
   └── Write minimal code to pass test
   └── No extra features or additions
   └── State: "✅ Test passing"

3. VERIFY PHASE (Check Results)
   └── Run all tests to ensure nothing broke
   └── Manual verification if needed
   └── State: "✅ Ready for next feature"
```

## 🤝 Contributing

This repository contains the free resources from Episode 9. Contributions welcome:

- Bug fixes in test examples
- Additional Stagehand patterns
- Documentation improvements
- Translation contributions

Please open an issue first to discuss major changes.

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- **Browserbase** for sponsoring this episode and creating Stagehand
- **Claude Code Community** for feedback and testing
- **Anthropic** for TDD best practices documentation

## 📺 Related Episodes

- **Episode 8**: [Advanced Statuslines and Usage Tracking](https://youtube.com/watch?v=oWsjmNSxoLQ)
- **Episode 7**: [Multi-Agent Workflows](https://youtube.com/watch?v=fb19HiCb8xk)
- **Episode 6**: [Programmatic Videos with Remotion](https://youtube.com/watch?v=aOQ04PPfu4A)

## 💬 Get Help

- **GitHub Issues**: Report bugs or request features
- **X/Twitter**: [@chongdashu](https://x.com/chongdashu)
- **Website**: [aioriented.dev](https://aioriented.dev)

---

**Remember**: The best way to reduce errors isn't to write more code - it's to write tests first! 🧪

Start with Stagehand today ► https://browserbase.plug.dev/ekNRhob
