import { useId } from 'react'
import type {
  ComponentPropsWithoutRef,
  HTMLInputTypeAttribute,
} from 'react'
import styles from './Input.module.scss'

export type InputSize = 'small' | 'medium' | 'large'

export interface InputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  label?: string
  type?: HTMLInputTypeAttribute
  size?: InputSize
  error?: string
  helperText?: string
  fullWidth?: boolean
}

export function Input({
  label,
  type = 'text',
  size = 'medium',
  error,
  helperText,
  fullWidth = false,
  required = false,
  disabled = false,
  readOnly = false,
  id,
  className,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...inputProps
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? `input-${generatedId}`
  const helperTextId = `${inputId}-helper`
  const errorId = `${inputId}-error`
  const hasError = Boolean(error)
  const describedBy = [
    ariaDescribedBy,
    helperText ? helperTextId : undefined,
    hasError ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(' ') || undefined

  const inputClasses = [styles.input, styles[size], className]
    .filter(Boolean)
    .join(' ')
  const fieldClasses = [styles.field, fullWidth && styles.fullWidth]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={fieldClasses}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
          {required && (
            <span className={styles.requiredIndicator} aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
      )}
      <input
        {...inputProps}
        id={inputId}
        type={type}
        className={inputClasses}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        aria-describedby={describedBy}
        aria-invalid={hasError ? true : ariaInvalid}
      />
      {helperText && (
        <p className={styles.helperText} id={helperTextId}>
          {helperText}
        </p>
      )}
      {hasError && (
        <p className={styles.error} id={errorId}>
          {error}
        </p>
      )}
    </div>
  )
}
