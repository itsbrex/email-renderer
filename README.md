# Email Renderer

A production-quality web application that renders email previews across different email clients and explains how and why each client mutates the email.

## What is Email Renderer?

Email Renderer accepts raw HTML email content and generates faithful previews showing how your email will appear in:

- **Gmail Web** (Chromium rendering engine)
- **Apple Mail** (WebKit rendering engine)
- **Outlook Windows** (Word-style simulation)
- **Yahoo Mail** (Chromium rendering engine)

Beyond just showing previews, Email Renderer analyses the differences between your original HTML and what each client produces, providing actionable insights about compatibility issues.

## Why Email Renderer?

Email clients are notoriously inconsistent in how they render HTML emails. What looks perfect in Gmail might break completely in Outlook. Email Renderer helps you:

1. **Preview** how your email renders across major clients
2. **Understand** what CSS properties and HTML elements are unsupported
3. **Debug** rendering issues before sending
4. **Learn** about email client limitations

## Supported Email Clients

| Client          | Engine                | Type           |
| --------------- | --------------------- | -------------- |
| Gmail Web       | Chromium (Playwright) | Real rendering |
| Apple Mail      | WebKit (Playwright)   | Real rendering |
| Outlook Windows | Word (simulated)      | **Simulation** |
| Yahoo Mail      | Chromium (Playwright) | Real rendering |

### Important: Outlook Simulation

Outlook Windows uses Microsoft Word as its rendering engine, which has significant limitations. Since we cannot run Word in a browser, the Outlook preview is a **simulation** that:

1. Inlines all CSS
2. Strips unsupported properties (flex, grid, border-radius, etc.)
3. Applies Word-like font defaults
4. Renders the transformed HTML in Chromium

This simulation helps identify compatibility issues but may not be pixel-perfect to actual Outlook rendering.

### Compatibility Testing with Can I Email

Email Renderer uses [Can I Email](https://www.caniemail.com) data to determine CSS and HTML compatibility across email clients. The system:

1. Fetches compatibility data from the Can I Email API
2. Builds client-specific compatibility rules for CSS properties and HTML elements
3. Generates warnings when unsupported or partially supported features are detected
4. Transforms email HTML to remove or flag incompatible features

This ensures that compatibility warnings and transformations are based on up-to-date, community-maintained compatibility data.

## Project Structure

```
email-renderer/
├── apps/
│   ├── web/                 # Next.js frontend
│   └── renderer/            # Playwright rendering service
└── packages/
    ├── types/               # Shared TypeScript types
    ├── core/                # Email normalisation pipeline
    ├── clients/             # Email client renderers
    └── analyser/            # DOM/CSS analysis
```

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.2.4+
- Node.js 20+

### Development Setup

```bash
# Install dependencies
bun install

# Install Playwright browsers (for renderer worker)
cd apps/renderer && bunx playwright install

# Start development servers
bun dev
```

This starts:

- Web app at `http://localhost:3000`
- Renderer worker at `http://localhost:3001`

### Environment Variables

Create `.env` in `apps/web`:

```env
RENDERER_URL=http://localhost:3001
RENDERER_API_KEY=your-secret-api-key
```

Create `.env` in `apps/renderer`:

```env
FRONTEND_URL=http://localhost:3000
RENDERER_API_KEY=your-secret-api-key
```

### High-Level Flow

```
User Input (HTML)
       │
       ▼
┌─────────────┐
│  Next.js    │
│  Frontend   │
└─────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│ /api/render │────▶│   Renderer  │
│             │     │    Worker   │
└─────────────┘     └─────────────┘
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│ /api/analyse│     │ Playwright  │
│             │     │ (Browsers)  │
└─────────────┘     └─────────────┘
       │
       ▼
   Analysis Results + Screenshots
```

## Limitations

1. Screenshots are rendered in isolated Playwright contexts, not actual email clients
2. Some Gmail-specific class prefixing behaviour may not be fully replicated
3. Dynamic content (web fonts, external images) may load differently
4. Outlook VML fallbacks are not fully simulated
