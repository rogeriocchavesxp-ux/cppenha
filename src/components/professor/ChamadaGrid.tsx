'use client'

import { useState, useCallback } from 'react'
import { salvarPresenca } from '@/actions/frequencias'

type AlunoFreq = {
  matricula_id: string
  aluno: { id: string; nome_completo: string; matricula: string | null }
  frequencia: { id?: string; presente: boolean; justificada: boolean } | null
}

type Props = {
  alunos: AlunoFreq[]
  disciplinaId: string
  data: string
}

type FreqRow = {
  presente: boolean
  status: 'idle' | 'saving' | 'saved' | 'error'
}

export function ChamadaGrid({ alunos, disciplinaId, data }: Props) {
  const [rows, setRows] = useState<Record<string, FreqRow>>(() => {
    const init: Record<string, FreqRow> = {}
    for (const a of alunos) {
      init[a.matricula_id] = {
        presente: a.frequencia?.presente ?? true,
        status:   'idle',
      }
    }
    return init
  })

  const handleToggle = useCallback(async (matriculaId: string) => {
    const current = rows[matriculaId]
    const novoValor = !current.presente
    setRows(r => ({ ...r, [matriculaId]: { presente: novoValor, status: 'saving' } }))
    try {
      await salvarPresenca({
        matricula_id:  matriculaId,
        disciplina_id: disciplinaId,
        data,
        presente:      novoValor,
      })
      setRows(r => ({ ...r, [matriculaId]: { presente: novoValor, status: 'saved' } }))
      setTimeout(() => setRows(r => ({ ...r, [matriculaId]: { ...r[matriculaId], status: 'idle' } })), 1500)
    } catch {
      setRows(r => ({ ...r, [matriculaId]: { presente: current.presente, status: 'error' } }))
    }
  }, [rows, disciplinaId, data])

  const presentes = Object.values(rows).filter(r => r.presente).length
  const total = alunos.length

  return (
    <div>
      {/* Resumo */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <span style={{ color: 'var(--text-muted)' }}>
          <span className="font-semibold" style={{ color: 'var(--green-600)' }}>{presentes}</span> presentes
        </span>
        <span style={{ color: 'var(--text-muted)' }}>
          <span className="font-semibold" style={{ color: 'var(--red-600)' }}>{total - presentes}</span> ausentes
        </span>
        <span style={{ color: 'var(--text-muted)' }}>{total} total</span>
      </div>

      <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--surface-raised)', borderBottom: '1px solid var(--border-soft)' }}>
              <th className="text-left px-5 py-3 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                Aluno
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-center" style={{ color: 'var(--text-muted)' }}>
                Presença
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
                    <button
                      onClick={() => handleToggle(a.matricula_id)}
                      disabled={row?.status === 'saving'}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors"
                      style={{
                        background: row?.presente ? 'var(--green-100)' : 'var(--red-100)',
                        color:      row?.presente ? 'var(--green-700)' : 'var(--red-700)',
                        border:     `2px solid ${row?.presente ? 'var(--green-400)' : 'var(--red-400)'}`,
                        fontSize:   '16px',
                      }}
                      title={row?.presente ? 'Presente — clique para marcar ausente' : 'Ausente — clique para marcar presente'}
                    >
                      {row?.presente ? '✓' : '✗'}
                    </button>
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
    </div>
  )
}
