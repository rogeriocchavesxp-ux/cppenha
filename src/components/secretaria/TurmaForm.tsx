'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { criarTurma } from '@/actions/turmas'
import type { AnoLetivo, NivelEnsino, Turno } from '@/types'

type Props = { anos: AnoLetivo[] }

export function TurmaForm({ anos }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro(null)
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      await criarTurma({
        nome:          fd.get('nome') as string,
        serie:         fd.get('serie') as string,
        nivel:         fd.get('nivel') as NivelEnsino,
        turno:         fd.get('turno') as Turno,
        capacidade:    Number(fd.get('capacidade')),
        ano_letivo_id: fd.get('ano_letivo_id') as string,
      })
      router.push('/secretaria/turmas')
    } catch (err: any) {
      setErro(err.message)
      setLoading(false)
    }
  }

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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Nome da Turma" name="nome" required placeholder="5º Ano A" />
      <Input label="Série" name="serie" required placeholder="5º Ano" />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Nível</label>
        <select name="nivel" required style={selectStyle}>
          <option value="">Selecionar...</option>
          <option value="infantil">Ed. Infantil</option>
          <option value="fundamental_1">Fund. I (1º–5º)</option>
          <option value="fundamental_2">Fund. II (6º–9º)</option>
          <option value="medio">Ensino Médio</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Turno</label>
        <select name="turno" required style={selectStyle}>
          <option value="">Selecionar...</option>
          <option value="manha">Manhã</option>
          <option value="tarde">Tarde</option>
          <option value="integral">Integral</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Ano Letivo</label>
        <select name="ano_letivo_id" required style={selectStyle}>
          <option value="">Selecionar...</option>
          {anos.map(a => (
            <option key={a.id} value={a.id}>
              {a.ano}{a.ativo ? ' (ativo)' : ''}
            </option>
          ))}
        </select>
      </div>

      <Input label="Capacidade" name="capacidade" type="number" min="1" max="60" defaultValue="30" required />

      {erro && (
        <p className="text-xs px-3 py-2 rounded-md" style={{ background: 'var(--red-100)', color: 'var(--red-600)' }}>
          {erro}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancelar</Button>
        <Button type="submit" loading={loading}>Criar Turma</Button>
      </div>
    </form>
  )
}
