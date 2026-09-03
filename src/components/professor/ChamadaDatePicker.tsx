'use client'

import { useRouter } from 'next/navigation'

type Props = { turmaId: string; disciplinaId: string; dataAtual: string }

export function ChamadaDatePicker({ turmaId, disciplinaId, dataAtual }: Props) {
  const router = useRouter()
  return (
    <input
      type="date"
      defaultValue={dataAtual}
      onChange={e => {
        router.push(`/professor/chamada/${turmaId}/${disciplinaId}?data=${e.target.value}`)
      }}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        padding: '6px 10px',
        fontSize: '13px',
        color: 'var(--text-primary)',
      }}
    />
  )
}
