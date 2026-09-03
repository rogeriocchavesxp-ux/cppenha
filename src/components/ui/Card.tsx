type Props = {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

const paddings = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' }

export function Card({ children, className = '', padding = 'md' }: Props) {
  return (
    <div
      className={`rounded-lg ${paddings[padding]} ${className}`}
      style={{ background: 'var(--surface)', border: '1px solid var(--border-soft)' }}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`pb-4 mb-4 ${className}`}
      style={{ borderBottom: '1px solid var(--border-soft)' }}
    >
      {children}
    </div>
  )
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
      {children}
    </h2>
  )
}
