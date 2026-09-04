'use server'

import { createSupabaseServer } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

const INFINITEPAY_HANDLE = process.env.INFINITEPAY_HANDLE ?? ''
const INFINITEPAY_TOKEN  = process.env.INFINITEPAY_TOKEN  ?? ''

export async function gerarLinkPagamento(mensalidadeId: string): Promise<string> {
  const sb = await createSupabaseServer()

  const { data: m, error } = await sb
    .from('mensalidades')
    .select('*, alunos ( nome_completo, matricula ), anos_letivos ( ano )')
    .eq('id', mensalidadeId)
    .single()

  if (error || !m) throw new Error('Mensalidade não encontrada.')
  if (m.status === 'pago') throw new Error('Esta mensalidade já está paga.')

  const MES_LABEL = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

  const appUrl    = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const nome      = (m as any).alunos?.nome_completo ?? 'Aluno'
  const matricula = (m as any).alunos?.matricula ?? mensalidadeId.slice(0, 8)
  const mes       = MES_LABEL[m.mes] ?? String(m.mes)
  const ano       = (m as any).anos_letivos?.ano ?? ''

  const payload = {
    handle:       INFINITEPAY_HANDLE,
    amount:       Math.round(m.valor * 100),
    name:         `Mensalidade ${mes}/${ano}`,
    description:  `Aluno: ${nome} · Matrícula: ${matricula}`,
    redirect_url: `${appUrl}/pais/financeiro?pago=1&mensalidade=${mensalidadeId}`,
    webhook_url:  `${appUrl}/api/webhook/infinitepay`,
    external_id:  mensalidadeId,
  }

  const res = await fetch('https://api.checkout.infinitepay.io/links', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${INFINITEPAY_TOKEN}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`InfinitePay: ${res.status} — ${txt}`)
  }

  const json = await res.json()
  return json.payment_url ?? json.url ?? json.link ?? ''
}
