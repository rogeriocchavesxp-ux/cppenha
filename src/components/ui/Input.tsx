import { InputHTMLAttributes, forwardRef } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-semibold uppercase"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              fontSize: '10px',
              letterSpacing: '0.1em',
            }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-md px-3 py-2 text-sm outline-none transition-shadow ${className}`}
          style={{
            background: 'var(--surface)',
            border: `1px solid ${error ? 'var(--red-600)' : 'var(--navy-200)'}`,
            color: 'var(--text-primary)',
          }}
          onFocus={e => {
            e.target.style.boxShadow = `0 0 0 2px var(--navy-100)`
            e.target.style.borderColor = 'var(--navy-500)'
          }}
          onBlur={e => {
            e.target.style.boxShadow = 'none'
            e.target.style.borderColor = error ? 'var(--red-600)' : 'var(--navy-200)'
          }}
          {...props}
        />
        {error && (
          <p className="text-xs" style={{ color: 'var(--red-600)' }}>{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
