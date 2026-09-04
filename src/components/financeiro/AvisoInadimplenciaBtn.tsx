'use client'

import { useState } from 'react'
import { enviarAvisoInadimplencia } from '@/actions/email'

type Props = { mensalidadeId: string }

export function AvisoInadimplenciaBtn({ mensalidadeId }: Props) {
  const [loading, setLoading] = useState(false)
  const [feito, setFeito] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function handleClick() {
    if (!confirm('Enviar aviso de inadimplência por email para o responsável financeiro?')) return
    setLoading(true)
    setErro(null)
    try {
      await enviarAvisoInadimplencia(mensalidadeId)
      setFeito(true)
    } catch (err: any) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (feito) {
    return <span className="text-xs" style={{ color: 'var(--green-600)' }}>Aviso enviado</span>
  }

  return (
    <div className="flex flex-col gap-0.5">
      <button
        onClick={handleClick}
        disabled={loading}
        className="text-xs font-medium px-3 py-1.5 rounded-md whitespace-nowrap"
        style={{ background: 'var(--amber-100)', color: 'var(--amber-600)', border: '1px solid var(--amber-600)' }}
      >
        {loading ? 'Enviando…' : 'Avisar por email'}
      </button>
      {erro && <p className="text-xs" style={{ color: 'var(--red-600)' }}>{erro}</p>}
    </div>
  )
}
