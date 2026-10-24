import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../../index'
import type { ButtonProps, ButtonSize, ButtonVariant } from '../../index'
import styles from './Button.module.scss'

const variants: ButtonVariant[] = [
  'primary',
  'secondary',
  'outline',
  'ghost',
  'danger',
]

const sizes: ButtonSize[] = ['small', 'medium', 'large']

describe('Button', () => {
  it('renders its children and defaults to primary, medium, and type button', () => {
    render(<Button>Save changes</Button>)

    const button = screen.getByRole('button', { name: 'Save changes' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass(styles.primary, styles.medium)
    expect(button).toHaveAttribute('type', 'button')
  })

  it('does not submit a form when its default type is used', () => {
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
    })

    render(
      <form onSubmit={onSubmit}>
        <Button>Save draft</Button>
      </form>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Save draft' }))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it.each(variants)('supports the %s variant', (variant) => {
    render(<Button variant={variant}>Action</Button>)

    expect(screen.getByRole('button', { name: 'Action' })).toHaveClass(
      styles[variant],
    )
  })

  it.each(sizes)('supports the %s size', (size) => {
    render(<Button size={size}>Action</Button>)

    expect(screen.getByRole('button', { name: 'Action' })).toHaveClass(
      styles[size],
    )
  })

  it('calls the click handler when activated', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)

    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not activate when disabled', () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Save' })

    expect(button).toBeDisabled()
    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('keeps the button name and announces loading through a status region', () => {
    const onClick = vi.fn()
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute(
      'aria-busy',
      'true',
    )
    expect(screen.getByRole('status')).toHaveTextContent('Loading')
    expect(screen.getAllByText('Loading')).toHaveLength(2)
    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('uses a custom loading text', () => {
    render(
      <Button loading loadingText="Saving your changes">
        Save
      </Button>,
    )

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(screen.getByRole('status')).toHaveTextContent('Saving your changes')
  })

  it('preserves a consumer-provided aria-label while loading', () => {
    render(
      <Button loading aria-label="Save form">
        Save
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Save form' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-label', 'Save form')
    expect(screen.getByRole('status')).toHaveTextContent('Loading')
  })

  it('applies full-width and custom classes', () => {
    render(
      <Button fullWidth className="consumer-class">
        Continue
      </Button>,
    )

    expect(screen.getByRole('button', { name: 'Continue' })).toHaveClass(
      styles.fullWidth,
      'consumer-class',
    )
  })

  it('preserves native button attributes', () => {
    render(
      <Button
        name="intent"
        value="publish"
        title="Publish changes"
        aria-describedby="publish-help"
      >
        Publish
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Publish' })
    expect(button).toHaveAttribute('name', 'intent')
    expect(button).toHaveAttribute('value', 'publish')
    expect(button).toHaveAttribute('title', 'Publish changes')
    expect(button).toHaveAttribute('aria-describedby', 'publish-help')
  })

  it('submits a form when type submit is explicitly set', () => {
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
    })

    render(
      <form onSubmit={onSubmit}>
        <Button type="submit">Submit form</Button>
      </form>,
    )
    const button = screen.getByRole('button', { name: 'Submit form' })

    expect(button).toHaveAttribute('type', 'submit')
    fireEvent.click(button)
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('exposes the public props type for native button attributes', () => {
    const props = {
      type: 'submit',
      name: 'action',
      variant: 'danger',
      size: 'small',
    } satisfies ButtonProps

    expect(props.type).toBe('submit')
  })
})
