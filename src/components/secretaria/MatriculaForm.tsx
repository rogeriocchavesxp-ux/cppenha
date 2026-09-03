'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { criarMatricula } from '@/actions/matriculas'
import type { Aluno, Turma, AnoLetivo } from '@/types'

type Props = {
  alunos: Aluno[]
  turmas: any[]
  anos: AnoLetivo[]
  alunoIdInicial?: string
}

export function MatriculaForm({ alunos, turmas, anos, alunoIdInicial }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const anoAtivo = anos.find(a => a.ativo)

  const selectStyle: React.CSSProperties = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro(null)
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      const m = await criarMatricula({
        aluno_id:      fd.get('aluno_id') as string,
        turma_id:      fd.get('turma_id') as string,
        ano_letivo_id: fd.get('ano_letivo_id') as string,
      })
      router.push(`/secretaria/alunos/${m.aluno_id}`)
    } catch (err: any) {
      setErro(err.message.includes('unique') ? 'Este aluno já possui matrícula neste ano letivo.' : err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Aluno</label>
        <select name="aluno_id" required style={selectStyle} defaultValue={alunoIdInicial ?? ''}>
          <option value="">Selecionar aluno...</option>
          {alunos.map(a => (
            <option key={a.id} value={a.id}>{a.nome_completo}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Turma</label>
        <select name="turma_id" required style={selectStyle}>
          <option value="">Selecionar turma...</option>
          {turmas.map((t: any) => (
            <option key={t.id} value={t.id}>
              {t.nome} — {t.anos_letivos?.ano}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Ano Letivo</label>
        <select name="ano_letivo_id" required style={selectStyle} defaultValue={anoAtivo?.id ?? ''}>
          <option value="">Selecionar ano...</option>
          {anos.map(a => (
            <option key={a.id} value={a.id}>{a.ano}{a.ativo ? ' (ativo)' : ''}</option>
          ))}
        </select>
      </div>

      {erro && (
        <p className="text-xs px-3 py-2 rounded-md" style={{ background: 'var(--red-100)', color: 'var(--red-600)' }}>
          {erro}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancelar</Button>
        <Button type="submit" loading={loading}>Matricular</Button>
      </div>
    </form>
  )
}
