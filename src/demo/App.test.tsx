import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import buttonSource from '../Components/Button/Button.tsx?source'
import buttonStylesSource from '../Components/Button/Button.module.scss?source'
import tokensSource from '../styles/tokens.scss?source'
import App from './App'

const originalClipboard = Object.getOwnPropertyDescriptor(
  navigator,
  'clipboard',
)

afterEach(() => {
  if (originalClipboard) {
    Object.defineProperty(navigator, 'clipboard', originalClipboard)
  } else {
    Reflect.deleteProperty(navigator, 'clipboard')
  }
})

describe('demo app', () => {
  it('shows the Button examples and form submission example', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Button' })).toBeInTheDocument()
    const variantNavigation = screen.getByRole('navigation', {
      name: 'Button variants',
    })
    const variantLinks = within(variantNavigation).getAllByRole('link')
    expect(variantLinks.map((link) => link.textContent)).toEqual([
      'Primary',
      'Secondary',
      'Outline',
      'Ghost',
      'Danger',
    ])
    for (const link of variantLinks) {
      expect(document.getElementById(link.getAttribute('href')!.slice(1))).toBeInTheDocument()
    }
    expect(
      screen.getByRole('button', { name: 'Save changes' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Submit form' }),
    ).toHaveAttribute('type', 'submit')
    expect(screen.getAllByRole('article')).toHaveLength(17)
    const importsExample = screen.getByRole('article', {
      name: 'Button imports',
    })
    expect(within(importsExample).queryByRole('code')).not.toBeInTheDocument()
    expect(
      within(importsExample).getByRole('button', { name: 'Show code' }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      within(importsExample).getByRole('button', {
        name: 'Show code',
      }),
    ).toBeVisible()
    expect(
      within(importsExample).queryByRole('button', {
        name: 'Copy Button imports code',
      }),
    ).not.toBeInTheDocument()

    const implementation = screen.getByRole('article', { name: 'Button.tsx' })
    expect(within(implementation).queryByRole('code')).not.toBeInTheDocument()
    expect(
      within(implementation).getByRole('button', { name: 'Show code' }),
    ).toHaveAttribute('aria-expanded', 'false')

    const stylesheet = screen.getByRole('article', {
      name: 'Button.module.scss',
    })
    expect(within(stylesheet).queryByRole('code')).not.toBeInTheDocument()
    expect(
      within(stylesheet).getByRole('button', { name: 'Show code' }),
    ).toHaveAttribute('aria-expanded', 'false')
    const tokens = screen.getByRole('article', { name: 'tokens.scss' })
    expect(within(tokens).queryByRole('code')).not.toBeInTheDocument()
    expect(
      within(tokens).getByRole('button', { name: 'Show code' }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getAllByRole('button', { name: 'Show code' })).toHaveLength(17)
  })

  it('copies the code belonging to each individual example', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    render(<App />)
    const examples = screen.getAllByRole('article')

    for (const example of examples) {
      const codeToggle = within(example).getByRole('button', {
        name: /^(Show|Hide) code$/,
      })
      if (codeToggle.getAttribute('aria-expanded') === 'false') {
        expect(within(example).queryByRole('code')).not.toBeInTheDocument()
        fireEvent.click(codeToggle)
      }
      const code = within(example).getByRole('code').textContent ?? ''
      const title = within(example).getByRole('heading', { level: 3 }).textContent
      if (title === 'Button.tsx') {
        expect(code).toBe(buttonSource)
      }
      if (title === 'Button.module.scss') {
        expect(code).toBe(buttonStylesSource)
      }
      if (title === 'tokens.scss') {
        expect(code).toBe(tokensSource)
      }

      fireEvent.click(
        within(example).getByRole('button', {
          name: `Copy ${title} code`,
        }),
      )

      await waitFor(() => {
        expect(writeText).toHaveBeenLastCalledWith(code)
        expect(
          within(example).getByText('Code copied to clipboard.'),
        ).toBeVisible()
      })
    }

    expect(writeText).toHaveBeenCalledTimes(examples.length)
  })
})
