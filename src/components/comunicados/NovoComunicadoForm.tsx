'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { criarComunicado } from '@/actions/comunicados'

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

const textareaStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  borderRadius: '6px',
  padding: '8px 12px',
  fontSize: '14px',
  width: '100%',
  outline: 'none',
  resize: 'vertical',
  minHeight: '100px',
  fontFamily: 'inherit',
  lineHeight: '1.6',
}

export function NovoComunicadoForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro(null)
    setSucesso(false)
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      await criarComunicado({
        titulo:   fd.get('titulo') as string,
        conteudo: fd.get('conteudo') as string,
        destino:  fd.get('destino') as any,
      })
      setSucesso(true)
      ;(e.target as HTMLFormElement).reset()
      router.refresh()
    } catch (err: any) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Título" name="titulo" required placeholder="Assunto do comunicado" />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Conteúdo</label>
        <textarea name="conteudo" required style={textareaStyle} placeholder="Mensagem completa..." />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Destinatários</label>
        <select name="destino" required style={selectStyle} defaultValue="todos">
          <option value="todos">Todos</option>
          <option value="colaboradores">Colaboradores</option>
          <option value="turma">Turma específica</option>
          <option value="aluno">Aluno específico</option>
        </select>
      </div>

      {erro && (
        <p className="text-xs px-3 py-2 rounded-md" style={{ background: 'var(--red-100)', color: 'var(--red-600)' }}>
          {erro}
        </p>
      )}
      {sucesso && (
        <p className="text-xs px-3 py-2 rounded-md" style={{ background: 'var(--green-100)', color: 'var(--green-600)' }}>
          Comunicado publicado com sucesso.
        </p>
      )}

      <Button type="submit" loading={loading}>Publicar</Button>
    </form>
  )
}
