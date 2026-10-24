import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.scss'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'

export type ButtonSize = 'small' | 'medium' | 'large'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  loadingText?: string
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'medium',
  loading = false,
  loadingText = 'Loading',
  fullWidth = false,
  disabled = false,
  className,
  children,
  type = 'button',
  'aria-busy': ariaBusy,
  ...buttonProps
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <button
        {...buttonProps}
        type={type}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading || ariaBusy}
      >
        {loading ? (
          <>
            <span className={styles.spinner} aria-hidden="true" />
            <span aria-hidden="true">{loadingText}</span>
            <span className={styles.visuallyHidden}>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
      {loading && (
        <span className={styles.visuallyHidden} role="status">
          {loadingText}
        </span>
      )}
    </>
  )
}
