# ComponentLibrary

React component library scaffolded with TypeScript, Vite, and SCSS Modules.

## Project layout

- `src/Components/` — reusable library components, including Button and Input.
- `src/Components/ComponentExample/` — reusable live-preview and copyable-code example card.
- `src/styles/tokens.scss` — opt-in CSS custom properties distributed with the package.
- `src/index.ts` — public library entry point.
- `src/demo/` — Vite documentation playground with reusable live-preview and copyable-code examples.
- `src/test/` — shared test setup.

## Commands

- `npm run dev` — start the demo app.
- `npm run build` — type-check, generate library declarations, and build ESM, CommonJS, and CSS artifacts into `dist/`.
- `npm run build:demo` — build the demo into `dist-demo/`.
- `npm run preview` — preview the demo production build.
- `npm run typecheck` — run TypeScript project checks.
- `npm test` — run Vitest and React Testing Library tests.

The demo uses client-side routes: `/components/button` and `/components/input`.
The root route redirects to Button. For deployments using clean URLs, configure
the web server to serve `index.html` for these routes so direct navigation and
refreshes reach the client-side router.

React and React DOM are peer dependencies of the published package. During local development they are installed as dev dependencies for the demo and tests. Consumers can import the optional token stylesheet from `componentlibrary/style.css`.

Storybook is intentionally deferred until the library has more components to document.

## Button

```tsx
import { Button } from 'componentlibrary'
import 'componentlibrary/style.css'

<Button variant="primary" size="medium" onClick={() => console.log('Clicked')}>
  Save changes
</Button>
```

The Button supports `primary`, `secondary`, `outline`, `ghost`, and `danger` variants; `small`, `medium`, and `large` sizes; and loading, disabled, and full-width states.

## Input

```tsx
import { Input } from 'componentlibrary'
import 'componentlibrary/style.css'

<Input
  label="Email address"
  type="email"
  required
  helperText="We will only use this for account updates."
/>
```

Input supports native input attributes, controlled and uncontrolled values, three sizes, helper text, error messages, and full-width layout. Labels and descriptions are associated accessibly, and an error message sets `aria-invalid`.

The `ComponentExample` export accepts `title`, optional `description`, source `code`, optional `language`, and preview `children`. It starts with its code panel collapsed and provides accessible disclosure and clipboard feedback.
