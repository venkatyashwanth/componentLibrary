import { useState } from 'react'
import { Input } from '../../Components/Input'
import { ComponentExample } from '../../Components/ComponentExample'
import styles from '../App.module.scss'

const imports = `import { Input } from "componentlibrary";
import "componentlibrary/style.css";

`

export default function InputPage() {
  const [controlledEmail, setControlledEmail] = useState('hello@example.com')

  const examples = [
    {
      title: 'Default text input',
      description: 'A labeled text field with the default medium size.',
      code: `${imports}export function DefaultTextInput() {
  return <Input label="Name" placeholder="Enter your name" />;
}`,
      preview: <Input label="Name" placeholder="Enter your name" />,
    },
    {
      title: 'Email input',
      description: 'Use a native email input for email validation and keyboards.',
      code: `${imports}export function EmailInput() {
  return <Input label="Email" type="email" placeholder="you@example.com" />;
}`,
      preview: (
        <Input label="Email" type="email" placeholder="you@example.com" />
      ),
    },
    {
      title: 'Required input',
      description: 'The native required attribute participates in form validation.',
      code: `${imports}export function RequiredInput() {
  return <Input label="Username" required />;
}`,
      preview: <Input label="Username" required />,
    },
    {
      title: 'Input with helper text',
      description: 'Provide extra context linked to the input for assistive technology.',
      code: `${imports}export function InputWithHelperText() {
  return (
    <Input
      label="Work email"
      type="email"
      helperText="We will only use this for account updates."
    />
  );
}`,
      preview: (
        <Input
          label="Work email"
          type="email"
          helperText="We will only use this for account updates."
        />
      ),
    },
    {
      title: 'Input error state',
      description: 'Errors are announced with invalid semantics and visible text.',
      code: `${imports}export function InputErrorState() {
  return (
    <Input
      label="Email address"
      type="email"
      defaultValue="not-an-email"
      error="Enter a valid email address."
    />
  );
}`,
      preview: (
        <Input
          label="Email address"
          type="email"
          defaultValue="not-an-email"
          error="Enter a valid email address."
        />
      ),
    },
    {
      title: 'Disabled input',
      description: 'Disabled fields cannot be focused or submitted.',
      code: `${imports}export function DisabledInput() {
  return <Input label="Account ID" value="acct_12345" disabled />;
}`,
      preview: <Input label="Account ID" value="acct_12345" disabled />,
    },
    {
      title: 'Read-only input',
      description: 'Read-only fields remain focusable and are included in form submission.',
      code: `${imports}export function ReadOnlyInput() {
  return <Input label="Order number" value="ORD-2048" readOnly />;
}`,
      preview: <Input label="Order number" value="ORD-2048" readOnly />,
    },
    {
      title: 'Small input',
      description: 'Compact sizing for dense layouts.',
      code: `${imports}export function SmallInput() {
  return <Input label="Small" size="small" placeholder="Small input" />;
}`,
      preview: <Input label="Small" size="small" placeholder="Small input" />,
    },
    {
      title: 'Medium input',
      description: 'The default size for most forms.',
      code: `${imports}export function MediumInput() {
  return <Input label="Medium" size="medium" placeholder="Medium input" />;
}`,
      preview: (
        <Input label="Medium" size="medium" placeholder="Medium input" />
      ),
    },
    {
      title: 'Large input',
      description: 'A larger target for prominent form fields.',
      code: `${imports}export function LargeInput() {
  return <Input label="Large" size="large" placeholder="Large input" />;
}`,
      preview: <Input label="Large" size="large" placeholder="Large input" />,
    },
    {
      title: 'Full-width input',
      description: 'Expand to fill the width of the containing block.',
      code: `${imports}export function FullWidthInput() {
  return <Input label="Search" fullWidth placeholder="Search" />;
}`,
      preview: <Input label="Search" fullWidth placeholder="Search" />,
    },
    {
      title: 'Controlled input',
      description: 'Use value and onChange to keep the field synchronized with React state.',
      code: `${imports}import { useState } from "react";

export function ControlledInput() {
  const [email, setEmail] = useState("hello@example.com");

  return (
    <Input
      label="Email"
      type="email"
      value={email}
      onChange={(event) => setEmail(event.target.value)}
    />
  );
}`,
      preview: (
        <Input
          label="Email"
          type="email"
          value={controlledEmail}
          onChange={(event) => setControlledEmail(event.target.value)}
        />
      ),
    },
  ]

  return (
    <>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>COMPONENT LIBRARY</p>
        <h1>Input</h1>
        <p className={styles.description}>
          Explore accessible native input fields, validation, and sizing. Each
          example includes a live preview and copyable TypeScript source.
        </p>
      </header>

      <section className={styles.section} aria-labelledby="input-examples-heading">
        <div className={styles.sectionHeader}>
          <h2 id="input-examples-heading">Examples</h2>
          <p className={styles.message}>
            Each field includes its own copyable usage snippet.
          </p>
        </div>
        <div className={styles.exampleGrid}>
          {examples.map((example) => (
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
    </>
  )
}
