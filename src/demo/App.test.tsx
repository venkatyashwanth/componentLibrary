import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useNavigate, useLocation, MemoryRouter } from 'react-router-dom'
import buttonSource from '../Components/Button/Button.tsx?source'
import buttonStylesSource from '../Components/Button/Button.module.scss?source'
import inputSource from '../Components/Input/Input.tsx?source'
import inputStylesSource from '../Components/Input/Input.module.scss?source'
import tokensSource from '../styles/tokens.scss?source'
import App from './App'

const originalClipboard = Object.getOwnPropertyDescriptor(
  navigator,
  'clipboard',
)

function CurrentLocation() {
  const location = useLocation()
  return <output data-testid="current-location">{location.pathname}</output>
}

function HistoryControls() {
  const navigate = useNavigate()

  return (
    <>
      <button type="button" onClick={() => navigate(-1)}>
        Test back
      </button>
      <button type="button" onClick={() => navigate(1)}>
        Test forward
      </button>
    </>
  )
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
      <CurrentLocation />
      <HistoryControls />
    </MemoryRouter>,
  )
}

afterEach(() => {
  if (originalClipboard) {
    Object.defineProperty(navigator, 'clipboard', originalClipboard)
  } else {
    Reflect.deleteProperty(navigator, 'clipboard')
  }
})

describe('demo app routes', () => {
  it('redirects the root route to Button documentation', async () => {
    renderAt('/')

    expect(
      await screen.findByRole('heading', { name: 'Button' }),
    ).toBeInTheDocument()
    expect(screen.getByTestId('current-location')).toHaveTextContent(
      '/components/button',
    )
    const mainNavigation = screen.getByRole('navigation', {
      name: 'Main navigation',
    })
    expect(mainNavigation).toHaveTextContent('Component Library')
    expect(
      within(mainNavigation).queryByRole('link', { name: 'Component Library' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('complementary'),
    ).not.toHaveTextContent('Component Library')
    expect(screen.getByRole('link', { name: 'Button' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('renders Button documentation only on the Button route', async () => {
    renderAt('/components/button')

    expect(
      await screen.findByRole('heading', { name: 'Button' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Button imports' })).toBeVisible()
    expect(screen.getByRole('article', { name: 'Button.tsx' })).toBeVisible()
    expect(screen.getByRole('article', { name: 'tokens.scss' })).toBeVisible()
    expect(
      screen.getByRole('button', { name: 'Submit form' }),
    ).toHaveAttribute('type', 'submit')
    expect(screen.getByRole('article', { name: 'Primary' })).toBeVisible()
    expect(
      screen.queryByRole('article', { name: 'Default text input' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Input', level: 1 }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Input' })).not.toHaveAttribute(
      'aria-current',
    )
  })

  it('renders Input documentation only on the Input route', async () => {
    renderAt('/components/input')

    expect(
      await screen.findByRole('heading', { name: 'Input', level: 1 }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('article', { name: 'Default text input' }),
    ).toBeVisible()
    expect(
      screen.getByRole('article', { name: 'Controlled input' }),
    ).toBeVisible()
    expect(
      screen.getByRole('article', { name: 'Input imports' }),
    ).toBeVisible()
    expect(screen.getByRole('article', { name: 'Input.tsx' })).toBeVisible()
    expect(
      screen.getByRole('article', { name: 'Input.module.scss' }),
    ).toBeVisible()
    expect(screen.getByRole('article', { name: 'tokens.scss' })).toBeVisible()
    expect(
      screen.queryByRole('article', { name: 'Button imports' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Button', level: 1 }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Input' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('navigates between pages with sidebar links and updates the active state', async () => {
    renderAt('/components/button')

    const inputLink = screen.getByRole('link', { name: 'Input' })
    fireEvent.click(inputLink)

    expect(
      await screen.findByRole('heading', { name: 'Input', level: 1 }),
    ).toBeInTheDocument()
    expect(screen.getByTestId('current-location')).toHaveTextContent(
      '/components/input',
    )
    expect(inputLink).toHaveAttribute('aria-current', 'page')
    expect(
      screen.queryByRole('article', { name: 'Primary' }),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: 'Button' }))
    expect(
      await screen.findByRole('heading', { name: 'Button', level: 1 }),
    ).toBeInTheDocument()
  })

  it('supports browser back and forward navigation', async () => {
    renderAt('/components/button')
    await screen.findByRole('heading', { name: 'Button', level: 1 })
    fireEvent.click(screen.getByRole('link', { name: 'Input' }))
    await screen.findByRole('heading', { name: 'Input', level: 1 })

    fireEvent.click(screen.getByRole('button', { name: 'Test back' }))
    expect(
      await screen.findByRole('heading', { name: 'Button', level: 1 }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Test forward' }))
    expect(
      await screen.findByRole('heading', { name: 'Input', level: 1 }),
    ).toBeInTheDocument()
  })

  it('shows a useful not-found page for unknown routes', async () => {
    renderAt('/components/unknown')

    expect(
      await screen.findByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: 'Components' }),
    ).toBeInTheDocument()
  })

  it('keeps Button implementation source and copy controls independent', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    renderAt('/components/button')
    await screen.findByRole('heading', { name: 'Button', level: 1 })

    for (const [title, expectedCode] of [
      ['Button.tsx', buttonSource],
      ['Button.module.scss', buttonStylesSource],
      ['tokens.scss', tokensSource],
    ]) {
      const example = screen.getByRole('article', { name: title })
      fireEvent.click(within(example).getByRole('button', { name: 'Show code' }))
      expect(within(example).getByRole('code').textContent).toBe(expectedCode)
      fireEvent.click(
        within(example).getByRole('button', { name: `Copy ${title} code` }),
      )

      await waitFor(() => {
        expect(writeText).toHaveBeenLastCalledWith(expectedCode)
        expect(
          within(example).getByText('Code copied to clipboard.'),
        ).toBeVisible()
      })
    }
  })

  it('keeps Input examples independently copyable with package imports', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    renderAt('/components/input')
    await screen.findByRole('heading', { name: 'Input', level: 1 })

    const titles = [
      'Default text input',
      'Email input',
      'Required input',
      'Input with helper text',
      'Input error state',
      'Disabled input',
      'Read-only input',
      'Small input',
      'Medium input',
      'Large input',
      'Full-width input',
      'Controlled input',
    ]

    for (const title of titles) {
      const example = screen.getByRole('article', { name: title })
      fireEvent.click(within(example).getByRole('button', { name: 'Show code' }))
      const code = within(example).getByRole('code').textContent ?? ''

      expect(code).toContain('import { Input } from "componentlibrary";')
      expect(code).toContain('import "componentlibrary/style.css";')

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
    expect(writeText).toHaveBeenCalledTimes(titles.length)
  })

  it('shows and copies the Input implementation and shared token sources', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    renderAt('/components/input')
    await screen.findByRole('heading', { name: 'Input', level: 1 })

    for (const [title, expectedCode] of [
      ['Input.tsx', inputSource],
      ['Input.module.scss', inputStylesSource],
      ['tokens.scss', tokensSource],
    ]) {
      const example = screen.getByRole('article', { name: title })
      fireEvent.click(within(example).getByRole('button', { name: 'Show code' }))
      expect(within(example).getByRole('code').textContent).toBe(expectedCode)
      fireEvent.click(
        within(example).getByRole('button', { name: `Copy ${title} code` }),
      )

      await waitFor(() => {
        expect(writeText).toHaveBeenLastCalledWith(expectedCode)
        expect(
          within(example).getByText('Code copied to clipboard.'),
        ).toBeVisible()
      })
    }
  })

  it('shows and copies the dedicated Input and stylesheet imports', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    renderAt('/components/input')
    await screen.findByRole('heading', { name: 'Input', level: 1 })
    const example = screen.getByRole('article', { name: 'Input imports' })

    fireEvent.click(within(example).getByRole('button', { name: 'Show code' }))
    const code = within(example).getByRole('code').textContent
    expect(code).toBe(
      'import { Input } from "componentlibrary";\nimport "componentlibrary/style.css";',
    )

    fireEvent.click(
      within(example).getByRole('button', { name: 'Copy Input imports code' }),
    )
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledExactlyOnceWith(code)
      expect(
        within(example).getByText('Code copied to clipboard.'),
      ).toBeVisible()
    })
  })
})
