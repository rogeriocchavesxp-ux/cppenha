'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { registrarPagamento } from '@/actions/mensalidades'

type Props = { mensalidadeId: string; valor: number }

export function RegistrarPagamentoBtn({ mensalidadeId, valor }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (!confirm(`Confirmar pagamento de ${valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}?`)) return
    setLoading(true)
    try {
      await registrarPagamento(mensalidadeId)
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-xs font-medium px-3 py-1.5 rounded-md whitespace-nowrap"
      style={{ background: 'var(--green-100)', color: 'var(--green-600)', border: '1px solid var(--green-400)' }}
    >
      {loading ? '...' : 'Registrar pago'}
    </button>
  )
}
