'use client'

import { useState } from 'react'
import { gerarLinkPagamento } from '@/actions/pagamento'

type Props = { mensalidadeId: string }

export function PagarBtn({ mensalidadeId }: Props) {
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setErro(null)
    try {
      const url = await gerarLinkPagamento(mensalidadeId)
      if (url) window.location.href = url
      else setErro('Link de pagamento não retornado.')
    } catch (err: any) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="text-xs font-medium px-3 py-1.5 rounded-md"
        style={{ background: 'var(--navy-900)', color: '#fff' }}
      >
        {loading ? 'Gerando link…' : 'Pagar online'}
      </button>
      {erro && (
        <p className="text-xs mt-1" style={{ color: 'var(--red-600)' }}>{erro}</p>
      )}
    </div>
  )
}
