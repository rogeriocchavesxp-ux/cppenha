'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { atualizarStatusMatricula } from '@/actions/matriculas'
import type { StatusMatricula } from '@/types'

const OPCOES: { value: StatusMatricula; label: string }[] = [
  { value: 'ativa',       label: 'Ativa'       },
  { value: 'trancada',    label: 'Trancada'    },
  { value: 'concluida',   label: 'Concluída'   },
  { value: 'transferida', label: 'Transferida' },
  { value: 'cancelada',   label: 'Cancelada'   },
]

interface Props {
  matriculaId: string
  statusAtual: StatusMatricula
  onAlunoClick?: () => void
  alunoHref: string
  alunoNome: string
}

export function MatriculaStatusMenu({ matriculaId, statusAtual, alunoHref, alunoNome }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  function alterarStatus(status: StatusMatricula) {
    if (status === statusAtual) { setOpen(false); return }
    setOpen(false)
    startTransition(async () => {
      await atualizarStatusMatricula(matriculaId, status)
      router.refresh()
    })
  }

  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        onClick={() => setOpen(v => !v)}
        disabled={isPending}
        className="w-7 h-7 flex items-center justify-center rounded-md transition-colors"
        style={{
          color: 'var(--text-muted)',
          background: open ? 'var(--surface-raised)' : 'transparent',
        }}
        title="Ações"
      >
        {isPending ? (
          <span style={{ fontSize: 11 }}>…</span>
        ) : (
          <span style={{ fontSize: 18, lineHeight: 1 }}>⋯</span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-8 z-50 min-w-[180px] rounded-lg py-1"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-soft)',
            boxShadow: '0 4px 16px rgba(0,0,0,.10)',
          }}
        >
          <a
            href={alunoHref}
            className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left transition-colors"
            style={{ color: 'var(--text-primary)' }}
            onClick={() => setOpen(false)}
          >
            Ver ficha do aluno
          </a>
          <div style={{ borderTop: '1px solid var(--border-soft)', margin: '4px 0' }} />
          <p className="px-3 pb-1 pt-0.5 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
            Alterar status
          </p>
          {OPCOES.map(op => (
            <button
              key={op.value}
              onClick={() => alterarStatus(op.value)}
              className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left transition-colors"
              style={{
                color: op.value === statusAtual ? 'var(--navy-700)' : 'var(--text-primary)',
                fontWeight: op.value === statusAtual ? 600 : 400,
                background: 'transparent',
              }}
            >
              {op.value === statusAtual && <span style={{ fontSize: 10 }}>●</span>}
              {op.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
