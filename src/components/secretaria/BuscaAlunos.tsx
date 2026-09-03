'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useTransition } from 'react'

type Props = { valorInicial?: string }

export function BuscaAlunos({ valorInicial }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    startTransition(() => {
      if (q) {
        router.push(`${pathname}?q=${encodeURIComponent(q)}`)
      } else {
        router.push(pathname)
      }
    })
  }

  return (
    <input
      type="search"
      defaultValue={valorInicial}
      onChange={handleChange}
      placeholder="Buscar por nome..."
      className="text-sm rounded-md px-3 py-2 outline-none w-64"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
      }}
    />
  )
}
