import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ComponentExampleProps } from './ComponentExample'
import { ComponentExample } from './ComponentExample'

const originalClipboard = Object.getOwnPropertyDescriptor(
  navigator,
  'clipboard',
)

function setClipboard(writeText?: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: writeText ? { writeText } : undefined,
  })
}

afterEach(() => {
  if (originalClipboard) {
    Object.defineProperty(navigator, 'clipboard', originalClipboard)
  } else {
    Reflect.deleteProperty(navigator, 'clipboard')
  }
})

describe('ComponentExample', () => {
  it('copies only its exact code and confirms success', async () => {
    const code = 'import { Button } from "componentlibrary";\n\n<Button />'
    const writeText = vi.fn().mockResolvedValue(undefined)
    setClipboard(writeText)

    render(
      <ComponentExample title="Primary button" code={code}>
        <button type="button">Preview</button>
      </ComponentExample>,
    )

    expect(screen.queryByRole('code')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Show code' }))
    expect(screen.getByRole('code').textContent).toBe(code)
    fireEvent.click(
      screen.getByRole('button', { name: 'Copy Primary button code' }),
    )

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Code copied to clipboard.',
    )
    expect(
      screen.getByRole('button', { name: 'Copy Primary button code' }),
    ).toHaveTextContent('Copied!')
    expect(writeText).toHaveBeenCalledExactlyOnceWith(code)
  })

  it('shows a manual-copy message and no success feedback if permission is denied', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('Permission denied'))
    setClipboard(writeText)

    render(
      <ComponentExample title="Danger button" code="<Button variant='danger' />">
        <button type="button">Preview</button>
      </ComponentExample>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Show code' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Copy Danger button code' }),
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Could not copy automatically',
    )
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(writeText).toHaveBeenCalledOnce()
  })

  it('handles environments where the Clipboard API is unavailable', async () => {
    setClipboard()

    render(
      <ComponentExample title="Ghost button" code="<Button variant='ghost' />">
        <button type="button">Preview</button>
      </ComponentExample>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Show code' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Copy Ghost button code' }),
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Select the code and copy it manually',
    )
    expect(screen.queryByText('Copied!')).not.toBeInTheDocument()
  })

  it('toggles its code panel with an accessible disclosure control', () => {
    render(
      <ComponentExample title="Outline button" code="<Button variant='outline' />">
        <button type="button">Preview</button>
      </ComponentExample>,
    )

    const showButton = screen.getByRole('button', { name: 'Show code' })
    expect(showButton).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('code')).not.toBeInTheDocument()
    expect(document.getElementById('outline-button-code')).toHaveAttribute(
      'inert',
    )

    fireEvent.click(showButton)

    const hideButton = screen.getByRole('button', { name: 'Hide code' })
    expect(hideButton).toHaveAttribute('aria-expanded', 'true')
    expect(document.getElementById('outline-button-code')).not.toHaveAttribute(
      'inert',
    )
    expect(screen.getByRole('code')).toHaveTextContent(
      "<Button variant='outline' />",
    )

    fireEvent.click(hideButton)
    expect(screen.queryByRole('code')).not.toBeInTheDocument()
    expect(document.getElementById('outline-button-code')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
  })

  it('starts every source panel hidden, including setup snippets', () => {
    const code =
      'import { Button } from "componentlibrary";\nimport "componentlibrary/style.css";'

    render(
      <ComponentExample
        title="Button imports"
        code={code}
      >
        <button type="button">Preview</button>
      </ComponentExample>,
    )

    expect(screen.queryByRole('code')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Copy Button imports code' }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Show code' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('exports a reusable props type', () => {
    const props = {
      title: 'Reusable example',
      code: '<Button />',
      language: 'TSX',
      children: 'Preview',
    } satisfies ComponentExampleProps

    expect(props.title).toBe('Reusable example')
  })
})
