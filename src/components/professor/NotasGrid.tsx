'use client'

import { useState, useCallback } from 'react'
import { salvarNota } from '@/actions/notas'

type AlunoNota = {
  matricula_id: string
  aluno: { id: string; nome_completo: string; matricula: string | null }
  nota: { id?: string; nota: number | null; recuperacao: number | null; observacao: string | null } | null
}

type Props = {
  alunos: AlunoNota[]
  disciplinaId: string
  bimestre: number
}

type Status = 'idle' | 'saving' | 'saved' | 'error'

type NotaRow = {
  nota: string
  recuperacao: string
  status: Status
}

function normalize(v: number | null | undefined): string {
  if (v === null || v === undefined) return ''
  return String(v)
}

export function NotasGrid({ alunos, disciplinaId, bimestre }: Props) {
  const [rows, setRows] = useState<Record<string, NotaRow>>(() => {
    const init: Record<string, NotaRow> = {}
    for (const a of alunos) {
      init[a.matricula_id] = {
        nota:        normalize(a.nota?.nota),
        recuperacao: normalize(a.nota?.recuperacao),
        status:      'idle',
      }
    }
    return init
  })

  const handleSave = useCallback(async (matriculaId: string) => {
    const row = rows[matriculaId]
    if (!row) return
    setRows(r => ({ ...r, [matriculaId]: { ...r[matriculaId], status: 'saving' } }))
    try {
      await salvarNota({
        matricula_id:  matriculaId,
        disciplina_id: disciplinaId,
        bimestre,
        nota:          row.nota !== '' ? parseFloat(row.nota) : null,
        recuperacao:   row.recuperacao !== '' ? parseFloat(row.recuperacao) : null,
      })
      setRows(r => ({ ...r, [matriculaId]: { ...r[matriculaId], status: 'saved' } }))
      setTimeout(() => setRows(r => ({ ...r, [matriculaId]: { ...r[matriculaId], status: 'idle' } })), 2000)
    } catch {
      setRows(r => ({ ...r, [matriculaId]: { ...r[matriculaId], status: 'error' } }))
    }
  }, [rows, disciplinaId, bimestre])

  const inputStyle = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: '14px',
    color: 'var(--text-primary)',
    width: '80px',
    textAlign: 'center' as const,
    outline: 'none',
    fontVariantNumeric: 'tabular-nums',
  }

  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'var(--surface-raised)', borderBottom: '1px solid var(--border-soft)' }}>
            <th className="text-left px-5 py-3 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
              Aluno
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-center" style={{ color: 'var(--text-muted)' }}>
              Nota
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-center" style={{ color: 'var(--text-muted)' }}>
              Recuperação
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-center" style={{ color: 'var(--text-muted)' }}>
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {alunos.map((a, i) => {
            const row = rows[a.matricula_id]
            const isLast = i === alunos.length - 1
            return (
              <tr
                key={a.matricula_id}
                style={{ borderBottom: isLast ? 'none' : '1px solid var(--border-soft)' }}
              >
                <td className="px-5 py-3">
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {a.aluno.nome_completo}
                  </p>
                  {a.aluno.matricula && (
                    <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                      {a.aluno.matricula}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    style={inputStyle}
                    value={row?.nota ?? ''}
                    onChange={e => setRows(r => ({ ...r, [a.matricula_id]: { ...r[a.matricula_id], nota: e.target.value, status: 'idle' } }))}
                    onBlur={() => handleSave(a.matricula_id)}
                    placeholder="—"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    style={inputStyle}
                    value={row?.recuperacao ?? ''}
                    onChange={e => setRows(r => ({ ...r, [a.matricula_id]: { ...r[a.matricula_id], recuperacao: e.target.value, status: 'idle' } }))}
                    onBlur={() => handleSave(a.matricula_id)}
                    placeholder="—"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  {row?.status === 'saving' && (
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Salvando…</span>
                  )}
                  {row?.status === 'saved' && (
                    <span className="text-xs font-medium" style={{ color: 'var(--green-600)' }}>Salvo</span>
                  )}
                  {row?.status === 'error' && (
                    <span className="text-xs font-medium" style={{ color: 'var(--red-600)' }}>Erro</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
