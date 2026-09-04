'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { gerarMensalidades } from '@/actions/mensalidades'

const selectStyle: React.CSSProperties = {
  background: 'var(--surface)', border: '1px solid var(--border)',
  color: 'var(--text-primary)', borderRadius: '6px', padding: '8px 12px',
  fontSize: '14px', width: '100%', outline: 'none',
}

const MES_OPCOES = [
  { v: 1, l: 'Janeiro' }, { v: 2, l: 'Fevereiro' }, { v: 3, l: 'Março' },
  { v: 4, l: 'Abril' }, { v: 5, l: 'Maio' }, { v: 6, l: 'Junho' },
  { v: 7, l: 'Julho' }, { v: 8, l: 'Agosto' }, { v: 9, l: 'Setembro' },
  { v: 10, l: 'Outubro' }, { v: 11, l: 'Novembro' }, { v: 12, l: 'Dezembro' },
]

type Props = { anos: any[]; anoAtivoId: string }

export function GerarMensalidadesForm({ anos, anoAtivoId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro(null)
    setSucesso(null)
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      const res = await gerarMensalidades({
        ano_letivo_id:  fd.get('ano_letivo_id') as string,
        mes:            parseInt(fd.get('mes') as string, 10),
        valor:          parseFloat(fd.get('valor') as string),
        dia_vencimento: parseInt(fd.get('dia_vencimento') as string, 10),
      })
      setSucesso(`${res.geradas} mensalidade(s) gerada(s) com sucesso.`)
      router.refresh()
    } catch (err: any) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  const mesAtual = new Date().getMonth() + 1

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Ano Letivo</label>
        <select name="ano_letivo_id" required style={selectStyle} defaultValue={anoAtivoId}>
          {anos.map((a: any) => (
            <option key={a.id} value={a.id}>{a.ano}{a.ativo ? ' (ativo)' : ''}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Mês</label>
        <select name="mes" required style={selectStyle} defaultValue={mesAtual}>
          {MES_OPCOES.map(m => (
            <option key={m.v} value={m.v}>{m.l}</option>
          ))}
        </select>
      </div>

      <Input
        label="Valor (R$)"
        name="valor"
        type="number"
        min="0.01"
        step="0.01"
        required
        placeholder="Ex: 850.00"
      />

      <Input
        label="Dia de vencimento"
        name="dia_vencimento"
        type="number"
        min="1"
        max="28"
        defaultValue="10"
        required
        hint="Use até o dia 28 para evitar problemas com meses curtos"
      />

      {erro && (
        <p className="text-xs px-3 py-2 rounded-md" style={{ background: 'var(--red-100)', color: 'var(--red-600)' }}>
          {erro}
        </p>
      )}
      {sucesso && (
        <p className="text-xs px-3 py-2 rounded-md" style={{ background: 'var(--green-100)', color: 'var(--green-600)' }}>
          {sucesso}
        </p>
      )}

      <Button type="submit" loading={loading}>Gerar para todos os alunos ativos</Button>
    </form>
  )
}
