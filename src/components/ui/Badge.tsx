type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info'

type Props = {
  variant?: Variant
  children: React.ReactNode
}

const styles: Record<Variant, React.CSSProperties> = {
  default: { background: 'var(--gray-100)', color: 'var(--gray-700)' },
  success: { background: 'var(--green-100)', color: 'var(--green-600)' },
  warning: { background: 'var(--amber-100)', color: 'var(--amber-600)' },
  danger:  { background: 'var(--red-100)', color: 'var(--red-600)' },
  info:    { background: 'var(--navy-50)', color: 'var(--navy-700)' },
}

export function Badge({ variant = 'default', children }: Props) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
      style={styles[variant]}
    >
      {children}
    </span>
  )
}
