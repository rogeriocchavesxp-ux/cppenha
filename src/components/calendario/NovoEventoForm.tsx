'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { criarEvento } from '@/actions/eventos'

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

const labelStyle: React.CSSProperties = { color: 'var(--text-primary)' }

interface Props { ano: number; mes: number }

export function NovoEventoForm({ ano, mes }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState(false)
  const [diaTodo, setDiaTodo] = useState(false)

  const dataDefault = `${ano}-${String(mes).padStart(2, '0')}-01`

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro(null)
    setSucesso(false)
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      await criarEvento({
        titulo:    fd.get('titulo') as string,
        descricao: fd.get('descricao') as string || undefined,
        inicio:    fd.get('inicio') as string,
        termino:   fd.get('termino') as string || undefined,
        dia_todo:  diaTodo,
        tipo:      fd.get('tipo') as string,
      })
      setSucesso(true)
      ;(e.target as HTMLFormElement).reset()
      setDiaTodo(false)
      router.refresh()
    } catch (err: any) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input label="Título *" name="titulo" required placeholder="Nome do evento" />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold" style={labelStyle}>Tipo</label>
        <select name="tipo" required style={selectStyle} defaultValue="geral">
          <option value="geral">Geral</option>
          <option value="feriado">Feriado</option>
          <option value="prova">Prova / Avaliação</option>
          <option value="reuniao">Reunião</option>
          <option value="culto">Culto</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="dia_todo"
          checked={diaTodo}
          onChange={e => setDiaTodo(e.target.checked)}
        />
        <label htmlFor="dia_todo" className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
          Dia todo
        </label>
      </div>

      <Input label="Data início *" name="inicio" type={diaTodo ? 'date' : 'datetime-local'} required defaultValue={dataDefault} />

      {!diaTodo && (
        <Input label="Data término" name="termino" type="datetime-local" />
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold" style={labelStyle}>Descrição</label>
        <textarea
          name="descricao"
          placeholder="Opcional"
          rows={3}
          style={{ ...selectStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.5' }}
        />
      </div>

      {erro && (
        <p className="text-xs px-3 py-2 rounded-md" style={{ background: 'var(--red-100)', color: 'var(--red-600)' }}>{erro}</p>
      )}
      {sucesso && (
        <p className="text-xs px-3 py-2 rounded-md" style={{ background: 'var(--green-100)', color: 'var(--green-600)' }}>
          Evento criado com sucesso.
        </p>
      )}

      <Button type="submit" loading={loading}>Criar evento</Button>
    </form>
  )
}
