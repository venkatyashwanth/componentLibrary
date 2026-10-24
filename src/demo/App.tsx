import { useState } from 'react'
import type { ReactNode } from 'react'
import { Button } from '../Components/Button'
import { ComponentExample } from '../Components/ComponentExample'
import buttonSource from '../Components/Button/Button.tsx?source'
import buttonStylesSource from '../Components/Button/Button.module.scss?source'
import styles from './App.module.scss'

const imports = `import { Button } from "componentlibrary";
import "componentlibrary/style.css";

`

const setupCode = `import { Button } from "componentlibrary";
import "componentlibrary/style.css";`

const buttonVariants = [
  { label: 'Primary', id: 'primary' },
  { label: 'Secondary', id: 'secondary' },
  { label: 'Outline', id: 'outline' },
  { label: 'Ghost', id: 'ghost' },
  { label: 'Danger', id: 'danger' },
]

const examples: {
  group: string
  title: string
  description: string
  code: string
  preview: ReactNode
}[] = [
  {
    group: 'Variants',
    title: 'Primary',
    description: 'The main action for the current page or flow.',
    code: `${imports}export function PrimaryExample() {
  return <Button>Save changes</Button>;
}`,
    preview: <Button>Save changes</Button>,
  },
  {
    group: 'Variants',
    title: 'Secondary',
    description: 'A quieter action for supporting tasks.',
    code: `${imports}export function SecondaryExample() {
  return <Button variant="secondary">Learn more</Button>;
}`,
    preview: <Button variant="secondary">Learn more</Button>,
  },
  {
    group: 'Variants',
    title: 'Outline',
    description: 'A bordered action that stays light in the visual hierarchy.',
    code: `${imports}export function OutlineExample() {
  return <Button variant="outline">View details</Button>;
}`,
    preview: <Button variant="outline">View details</Button>,
  },
  {
    group: 'Variants',
    title: 'Ghost',
    description: 'A low-emphasis action without a visible border.',
    code: `${imports}export function GhostExample() {
  return <Button variant="ghost">Cancel</Button>;
}`,
    preview: <Button variant="ghost">Cancel</Button>,
  },
  {
    group: 'Variants',
    title: 'Danger',
    description: 'Use for destructive or irreversible actions.',
    code: `${imports}export function DangerExample() {
  return <Button variant="danger">Delete project</Button>;
}`,
    preview: <Button variant="danger">Delete project</Button>,
  },
  {
    group: 'Sizes',
    title: 'Small',
    description: 'Compact sizing for dense layouts.',
    code: `${imports}export function SmallExample() {
  return <Button size="small">Small button</Button>;
}`,
    preview: <Button size="small">Small button</Button>,
  },
  {
    group: 'Sizes',
    title: 'Medium',
    description: 'The default size for most actions.',
    code: `${imports}export function MediumExample() {
  return <Button size="medium">Medium button</Button>;
}`,
    preview: <Button size="medium">Medium button</Button>,
  },
  {
    group: 'Sizes',
    title: 'Large',
    description: 'A more prominent action with a larger hit area.',
    code: `${imports}export function LargeExample() {
  return <Button size="large">Large button</Button>;
}`,
    preview: <Button size="large">Large button</Button>,
  },
  {
    group: 'States & behavior',
    title: 'Disabled',
    description: 'Disabled buttons cannot be activated.',
    code: `${imports}export function DisabledExample() {
  return <Button disabled>Unavailable</Button>;
}`,
    preview: <Button disabled>Unavailable</Button>,
  },
  {
    group: 'States & behavior',
    title: 'Loading',
    description: 'Loading disables interaction and announces its status.',
    code: `${imports}export function LoadingExample() {
  return (
    <Button loading loadingText="Saving changes">
      Save
    </Button>
  );
}`,
    preview: (
      <Button loading loadingText="Saving changes">
        Save
      </Button>
    ),
  },
  {
    group: 'States & behavior',
    title: 'Full width',
    description: 'Expand to fill the width of the containing block.',
    code: `${imports}export function FullWidthExample() {
  return <Button fullWidth>Continue</Button>;
}`,
    preview: (
      <div className={styles.fullWidthPreview}>
        <Button fullWidth>Continue</Button>
      </div>
    ),
  },
]

function App() {
  const [message, setMessage] = useState('Click the example button to try it.')
  const [submitted, setSubmitted] = useState(false)
  const [activeVariant, setActiveVariant] = useState('primary')

  const behaviorExamples = [
    {
      title: 'Click handler',
      description: 'Attach a handler to respond to activation.',
      code: `${imports}export function ClickHandlerExample() {
  return (
    <Button onClick={() => console.log("Button clicked")}>
      Click me
    </Button>
  );
}`,
      preview: (
        <Button onClick={() => setMessage('The button was clicked.')}>
          Click me
        </Button>
      ),
    },
    {
      title: 'Form submission',
      description: 'Use type="submit" to submit the containing form.',
      code: `${imports}import type { FormEvent } from "react";

export function FormExample() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Form submitted");
  }

  return (
    <form onSubmit={handleSubmit}>
      <Button type="submit">Submit form</Button>
    </form>
  );
}`,
      preview: (
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault()
            setSubmitted(true)
          }}
        >
          <Button type="submit">Submit form</Button>
          {submitted && <span className={styles.formFeedback}>Submitted!</span>}
        </form>
      ),
    },
  ]

  const groups = ['Variants', 'Sizes', 'States & behavior']

  return (
    <div className={styles.playgroundLayout}>
      <aside className={styles.variantSidebar}>
        <p className={styles.sidebarLabel}>COMPONENTS</p>
        <p className={styles.sidebarSection}>
          <span className={styles.sidebarIcon} aria-hidden="true" />
          Button
        </p>
        <nav className={styles.variantNav} aria-label="Button variants">
          {buttonVariants.map((variant) => (
            <a
              className={`${styles.variantLink} ${activeVariant === variant.id ? styles.variantLinkActive : ''}`}
              href={`#${variant.id}`}
              key={variant.id}
              aria-current={activeVariant === variant.id ? 'location' : undefined}
              onClick={() => setActiveVariant(variant.id)}
            >
              {variant.label}
            </a>
          ))}
        </nav>
      </aside>
      <main className={styles.demo}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>COMPONENT LIBRARY</p>
        <h1>Button</h1>
        <p className={styles.description}>
          Explore button variants, states, and usage. Each example includes a live
          preview and copyable TypeScript source.
        </p>
      </header>

      <section className={styles.section} aria-labelledby="setup-heading">
        <div className={styles.sectionHeader}>
          <h2 id="setup-heading">Getting started</h2>
        </div>
        <div className={styles.setupExample}>
          <ComponentExample
            title="Button imports"
            description="Copy these imports into your React component to use Button and its stylesheet."
            code={setupCode}
          >
            <Button>Ready to use</Button>
          </ComponentExample>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="source-heading">
        <div className={styles.sectionHeader}>
          <h2 id="source-heading">Button implementation</h2>
          <p className={styles.message}>
            The source below is loaded directly from the component files.
          </p>
        </div>
        <div className={styles.sourceGrid}>
          <ComponentExample
            title="Button.tsx"
            description="The typed React component, props, and behavior."
            code={buttonSource}
            language="TSX"
          >
            <Button>Component preview</Button>
          </ComponentExample>
          <ComponentExample
            title="Button.module.scss"
            description="Scoped variant, size, state, and responsive-motion styles."
            code={buttonStylesSource}
            language="SCSS"
          >
            <Button variant="outline">Style preview</Button>
          </ComponentExample>
        </div>
      </section>

      {groups.map((group) => (
        <section
          className={styles.section}
          key={group}
          aria-labelledby={`${group.replaceAll(/[^a-z0-9]+/gi, '-').toLowerCase()}-heading`}
        >
          <div className={styles.sectionHeader}>
            <h2 id={`${group.replaceAll(/[^a-z0-9]+/gi, '-').toLowerCase()}-heading`}>
              {group}
            </h2>
            {group === 'States & behavior' && (
              <p className={styles.message} role="status">
                {message}
              </p>
            )}
          </div>
          <div className={styles.exampleGrid}>
            {examples
              .filter((example) => example.group === group)
              .map((example) => (
                <ComponentExample
                  key={example.title}
                  title={example.title}
                  description={example.description}
                  code={example.code}
                >
                  {example.preview}
                </ComponentExample>
              ))}
            {group === 'States & behavior' &&
              behaviorExamples.map((example) => (
                <ComponentExample
                  key={example.title}
                  title={example.title}
                  description={example.description}
                  code={example.code}
                >
                  {example.preview}
                </ComponentExample>
              ))}
          </div>
        </section>
      ))}
      </main>
    </div>
  )
}

export default App
