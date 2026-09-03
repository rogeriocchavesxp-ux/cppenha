import { ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size    = 'sm' | 'md' | 'lg'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const styles: Record<Variant, React.CSSProperties> = {
  primary:   { background: 'var(--navy-900)', color: '#FFFFFF', border: '1px solid transparent' },
  secondary: { background: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' },
  ghost:     { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid transparent' },
  danger:    { background: 'var(--red-100)', color: 'var(--red-600)', border: '1px solid transparent' },
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'primary', size = 'md', loading, disabled, children, className = '', style, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]} ${className}`}
        style={{ ...styles[variant], ...style }}
        {...props}
      >
        {loading && (
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
