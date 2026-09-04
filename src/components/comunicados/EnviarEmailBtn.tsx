'use client'

import { useState } from 'react'
import { enviarComunicadoPorEmail } from '@/actions/email'

type Props = { comunicadoId: string }

export function EnviarEmailBtn({ comunicadoId }: Props) {
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  async function handleClick() {
    if (!confirm('Enviar este comunicado por email para todos os destinatários?')) return
    setLoading(true)
    setResultado(null)
    setErro(null)
    try {
      const res = await enviarComunicadoPorEmail(comunicadoId)
      setResultado(`Enviado para ${res.enviados} destinatário(s).`)
    } catch (err: any) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleClick}
        disabled={loading}
        className="text-xs font-medium px-3 py-1.5 rounded-md whitespace-nowrap"
        style={{ background: 'var(--navy-100)', color: 'var(--navy-700)', border: '1px solid var(--navy-200)' }}
      >
        {loading ? 'Enviando…' : 'Enviar por email'}
      </button>
      {resultado && (
        <p className="text-xs" style={{ color: 'var(--green-600)' }}>{resultado}</p>
      )}
      {erro && (
        <p className="text-xs" style={{ color: 'var(--red-600)' }}>{erro}</p>
      )}
    </div>
  )
}
