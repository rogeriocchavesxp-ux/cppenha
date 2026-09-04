'use server'

import { createSupabaseServer } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function listarMensalidades(filtro?: {
  status?: string
  anoLetivoId?: string
  mes?: number
}) {
  const sb = await createSupabaseServer()
  let q = sb
    .from('mensalidades')
    .select(`
      *,
      alunos ( id, nome_completo, matricula ),
      anos_letivos ( id, ano )
    `)
    .order('vencimento', { ascending: true })

  if (filtro?.status && filtro.status !== 'todos') q = q.eq('status', filtro.status)
  if (filtro?.anoLetivoId)  q = q.eq('ano_letivo_id', filtro.anoLetivoId)
  if (filtro?.mes)          q = q.eq('mes', filtro.mes)

  const { data, error } = await q
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function resumoFinanceiro(anoLetivoId?: string) {
  const sb = await createSupabaseServer()
  let q = sb.from('mensalidades').select('status, valor, vencimento')
  if (anoLetivoId) q = q.eq('ano_letivo_id', anoLetivoId)
  const { data, error } = await q
  if (error) throw new Error(error.message)
  const rows = data ?? []

  const hoje = new Date().toISOString().split('T')[0]
  const totalPago     = rows.filter(r => r.status === 'pago').reduce((s, r) => s + (r.valor ?? 0), 0)
  const qtdPendente   = rows.filter(r => ['pendente', 'atrasado'].includes(r.status)).length
  const qtdAtrasado   = rows.filter(r => r.status === 'pendente' && r.vencimento < hoje).length
  const valorPendente = rows.filter(r => ['pendente', 'atrasado'].includes(r.status)).reduce((s, r) => s + (r.valor ?? 0), 0)

  return { totalPago, qtdPendente, qtdAtrasado, valorPendente, total: rows.length }
}

export async function gerarMensalidades(data: {
  ano_letivo_id: string
  mes: number
  valor: number
  dia_vencimento: number
}) {
  const sb = await createSupabaseServer()

  // busca todos os alunos com matrícula ativa neste ano letivo
  const { data: matriculas, error: errM } = await sb
    .from('matriculas')
    .select('aluno_id')
    .eq('ano_letivo_id', data.ano_letivo_id)
    .eq('status', 'ativa')

  if (errM) throw new Error(errM.message)
  if (!matriculas || matriculas.length === 0) throw new Error('Nenhuma matrícula ativa neste ano letivo.')

  const { data: anoLetivo } = await sb
    .from('anos_letivos')
    .select('ano')
    .eq('id', data.ano_letivo_id)
    .single()

  const ano = anoLetivo?.ano ?? new Date().getFullYear()
  const vencimento = `${ano}-${String(data.mes).padStart(2, '0')}-${String(data.dia_vencimento).padStart(2, '0')}`

  const registros = matriculas.map(m => ({
    aluno_id:     m.aluno_id,
    ano_letivo_id: data.ano_letivo_id,
    mes:          data.mes,
    valor:        data.valor,
    vencimento,
    status:       'pendente' as const,
  }))

  // upsert — não duplica se já existir (unique: aluno_id, ano_letivo_id, mes)
  const { error } = await sb
    .from('mensalidades')
    .upsert(registros, { onConflict: 'aluno_id,ano_letivo_id,mes', ignoreDuplicates: true })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/financeiro')
  return { geradas: registros.length }
}

export async function registrarPagamento(id: string, valorPago?: number) {
  const sb = await createSupabaseServer()
  const hoje = new Date().toISOString().split('T')[0]

  const { data: m } = await sb.from('mensalidades').select('valor').eq('id', id).single()

  const { error } = await sb
    .from('mensalidades')
    .update({
      status:    'pago',
      pago_em:   hoje,
      valor_pago: valorPago ?? m?.valor ?? null,
      atualizado_em: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/financeiro')
  revalidatePath('/pais/financeiro')
}

export async function marcarComoAtrasada(id: string) {
  const sb = await createSupabaseServer()
  const { error } = await sb
    .from('mensalidades')
    .update({ status: 'atrasado', atualizado_em: new Date().toISOString() })
    .eq('id', id)
    .eq('status', 'pendente')
  if (error) throw new Error(error.message)
  revalidatePath('/admin/financeiro')
}

export async function atualizarAtrasadas() {
  const sb = await createSupabaseServer()
  const hoje = new Date().toISOString().split('T')[0]
  const { error } = await sb
    .from('mensalidades')
    .update({ status: 'atrasado', atualizado_em: new Date().toISOString() })
    .eq('status', 'pendente')
    .lt('vencimento', hoje)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/financeiro')
}
