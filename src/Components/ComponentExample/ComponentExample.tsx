import { useState } from 'react'
import type { ReactNode } from 'react'
import downArrow from '../../assets/down_arrow.svg'
import { Button } from '../Button'
import styles from './ComponentExample.module.scss'

export type ComponentExampleProps = {
  title: string
  description?: string
  code: string
  language?: string
  children: ReactNode
}

type CopyState = 'idle' | 'copied' | 'error'

export function ComponentExample({
  title,
  description,
  code,
  language = 'TSX',
  children,
}: ComponentExampleProps) {
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const [isCodeVisible, setIsCodeVisible] = useState(false)
  const exampleId = title.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')
  const codePanelId = `${exampleId}-code`

  async function copyCode() {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API is unavailable')
      }

      await navigator.clipboard.writeText(code)
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
  }

  return (
    <article
      id={exampleId}
      className={styles.example}
      aria-labelledby={`${exampleId}-title`}
    >
      <header className={styles.header}>
        <div>
          <h3 id={`${exampleId}-title`} className={styles.title}>
            {title}
          </h3>
          {description && <p className={styles.description}>{description}</p>}
        </div>
      </header>

      <div
        className={styles.preview}
        role="group"
        aria-label={`${title} live preview`}
      >
        {children}
      </div>

      <div className={styles.codeToggle}>
        <Button
          variant="ghost"
          size="small"
          aria-expanded={isCodeVisible}
          aria-controls={codePanelId}
          onClick={() => setIsCodeVisible((visible) => !visible)}
        >
          <img
            src={downArrow}
            alt=""
            className={`${styles.chevron} ${isCodeVisible ? styles.chevronOpen : ''}`}
            aria-hidden="true"
          />
          {isCodeVisible ? 'Hide code' : 'Show code'}
        </Button>
      </div>
      <section
        id={codePanelId}
        className={`${styles.codePanel} ${isCodeVisible ? styles.codePanelOpen : ''}`}
        aria-hidden={!isCodeVisible}
        inert={!isCodeVisible}
      >
        <div className={styles.codePanelInner}>
          <div className={styles.codeHeader}>
            <span className={styles.language}>{language}</span>
            <Button
              className={styles.copyButton}
              variant="ghost"
              size="small"
              onClick={copyCode}
              aria-label={`Copy ${title} code`}
            >
              {copyState === 'copied' ? 'Copied!' : 'Copy code'}
            </Button>
          </div>
          <pre className={styles.code}>
            <code>{code}</code>
          </pre>
          {copyState === 'copied' && (
            <p className={styles.success} role="status">
              Code copied to clipboard.
            </p>
          )}
          {copyState === 'error' && (
            <p className={styles.error} role="alert">
              Could not copy automatically. Select the code and copy it manually.
            </p>
          )}
        </div>
      </section>
    </article>
  )
}
