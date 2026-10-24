import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { Input } from '../../index'
import type { InputProps, InputSize } from '../../index'
import styles from './Input.module.scss'

const sizes: InputSize[] = ['small', 'medium', 'large']

describe('Input', () => {
  it('renders a native text input by default', () => {
    render(<Input label="Name" />)

    const input = screen.getByRole('textbox', { name: 'Name' })
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
    expect(input).toHaveClass(styles.medium)
  })

  it('associates its visible label with the input', () => {
    render(<Input label="Email address" />)

    const input = screen.getByLabelText('Email address')
    expect(input).toHaveAttribute('id')
    expect(screen.getByText('Email address')).toHaveAttribute(
      'for',
      input.getAttribute('id'),
    )
  })

  it.each(sizes)('supports the %s size', (size) => {
    render(<Input label="Name" size={size} />)

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveClass(
      styles[size],
    )
  })

  it('supports controlled input changes', () => {
    function ControlledInput() {
      const [value, setValue] = useState('Initial')

      return (
        <Input
          aria-label="Controlled value"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      )
    }

    render(<ControlledInput />)
    const input = screen.getByRole('textbox', { name: 'Controlled value' })

    fireEvent.change(input, {
      target: { value: 'Updated' },
    })

    expect(input).toHaveValue('Updated')
  })

  it('supports uncontrolled input values', () => {
    render(<Input aria-label="Uncontrolled value" defaultValue="Initial" />)
    const input = screen.getByRole('textbox', { name: 'Uncontrolled value' })

    expect(input).toHaveValue('Initial')
    fireEvent.change(input, { target: { value: 'Updated' } })
    expect(input).toHaveValue('Updated')
  })

  it('renders helper text and associates it with the input', () => {
    render(
      <Input
        label="Email"
        helperText="We will only use this for account updates."
      />,
    )
    const input = screen.getByRole('textbox', { name: 'Email' })
    const helperText = screen.getByText(
      'We will only use this for account updates.',
    )

    expect(input.getAttribute('aria-describedby')).toContain(
      helperText.getAttribute('id'),
    )
  })

  it('renders error text with invalid semantics and associates it with the input', () => {
    render(<Input label="Email" error="Enter a valid email address." />)
    const input = screen.getByRole('textbox', { name: 'Email' })
    const error = screen.getByText('Enter a valid email address.')

    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input.getAttribute('aria-describedby')).toContain(
      error.getAttribute('id'),
    )
  })

  it('connects both helper and error messages while preserving other descriptions', () => {
    render(
      <>
        <p id="additional-help">Additional information.</p>
        <Input
          label="Email"
          aria-describedby="additional-help"
          helperText="Use your work address."
          error="Enter a valid email address."
        />
      </>,
    )
    const input = screen.getByRole('textbox', { name: 'Email' })
    const describedBy = input.getAttribute('aria-describedby') ?? ''

    expect(describedBy).toContain('additional-help')
    expect(describedBy).toContain(screen.getByText('Use your work address.').id)
    expect(describedBy).toContain(
      screen.getByText('Enter a valid email address.').id,
    )
  })

  it('preserves required, disabled, and read-only native states', () => {
    render(
      <>
        <Input label="Required" required />
        <Input label="Disabled" disabled />
        <Input label="Read-only" readOnly value="Fixed value" />
      </>,
    )

    expect(screen.getByRole('textbox', { name: 'Required' })).toBeRequired()
    expect(screen.getByRole('textbox', { name: 'Disabled' })).toBeDisabled()
    expect(screen.getByRole('textbox', { name: 'Read-only' })).toHaveAttribute(
      'readonly',
    )
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
  })

  it('preserves a custom ID and generates unique IDs when omitted', () => {
    const { rerender } = render(
      <>
        <Input label="Custom ID" id="custom-input" />
        <Input label="Generated one" />
        <Input label="Generated two" />
      </>,
    )

    expect(screen.getByLabelText('Custom ID')).toHaveAttribute(
      'id',
      'custom-input',
    )
    const firstGenerated = screen.getByLabelText('Generated one').getAttribute('id')
    const secondGenerated = screen.getByLabelText('Generated two').getAttribute('id')
    expect(firstGenerated).toBeTruthy()
    expect(secondGenerated).toBeTruthy()
    expect(firstGenerated).not.toBe(secondGenerated)

    rerender(<Input label="Custom ID" id="custom-input" />)
    expect(screen.getByLabelText('Custom ID')).toHaveAttribute(
      'id',
      'custom-input',
    )
  })

  it('applies full-width and custom classes', () => {
    const { container } = render(
      <Input label="Name" fullWidth className="consumer-class" />,
    )

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveClass(
      'consumer-class',
    )
    expect(container.firstElementChild).toHaveClass(styles.fullWidth)
  })

  it('preserves native name, type, autocomplete, and input attributes', () => {
    render(
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        maxLength={100}
      />,
    )
    const input = screen.getByRole('textbox', { name: 'Email' })

    expect(input).toHaveAttribute('name', 'email')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('autocomplete', 'email')
    expect(input).toHaveAttribute('placeholder', 'you@example.com')
    expect(input).toHaveAttribute('maxlength', '100')
  })

  it('exposes the public props type with native input attributes', () => {
    const props = {
      type: 'email',
      name: 'email',
      size: 'small',
      helperText: 'Account email',
    } satisfies InputProps

    expect(props.name).toBe('email')
  })
})
