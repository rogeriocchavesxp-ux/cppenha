'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Props = {
  titulo: string
  breadcrumb?: { label: string; href?: string }[]
}

export function Topbar({ titulo, breadcrumb }: Props) {
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header
      className="flex items-center justify-between px-6 py-3 shrink-0"
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border-soft)',
        minHeight: '56px',
      }}
    >
      <div>
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="flex items-center gap-1.5 mb-0.5">
            {breadcrumb.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>/</span>
                )}
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-xs hover:underline"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span
                    className="text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {item.label}
                  </span>
                )}
              </span>
            ))}
          </div>
        )}
        <h1
          className="font-semibold text-base leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {titulo}
        </h1>
      </div>

      <button
        onClick={handleLogout}
        className="text-xs font-medium px-3 py-1.5 rounded-md transition-colors cursor-pointer"
        style={{
          color: 'var(--text-secondary)',
          background: 'var(--gray-100)',
        }}
      >
        Sair
      </button>
    </header>
  )
}
