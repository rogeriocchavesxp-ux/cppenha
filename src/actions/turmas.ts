'use server'

import { createSupabaseServer } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import type { NivelEnsino, Turno } from '@/types'

export async function criarTurma(data: {
  nome: string
  serie: string
  nivel: NivelEnsino
  turno: Turno
  capacidade: number
  ano_letivo_id: string
}) {
  const supabase = await createSupabaseServer()
  const { data: turma, error } = await supabase
    .from('turmas')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/secretaria/turmas')
  return turma
}

export async function atualizarTurma(id: string, data: Partial<{
  nome: string
  serie: string
  nivel: NivelEnsino
  turno: Turno
  capacidade: number
}>) {
  const supabase = await createSupabaseServer()
  const { error } = await supabase.from('turmas').update(data).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/secretaria/turmas')
}

export async function excluirTurma(id: string) {
  const supabase = await createSupabaseServer()
  const { error } = await supabase.from('turmas').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/secretaria/turmas')
}

export async function listarTurmas(anoLetivoId?: string) {
  const supabase = await createSupabaseServer()
  let query = supabase
    .from('turmas')
    .select('*, anos_letivos(ano)')
    .order('nome')

  if (anoLetivoId) query = query.eq('ano_letivo_id', anoLetivoId)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function listarAnosLetivos() {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('anos_letivos')
    .select('*')
    .order('ano', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function criarAnoLetivo(data: {
  ano: number
  inicio: string
  termino: string
  ativo?: boolean
}) {
  const supabase = await createSupabaseServer()

  if (data.ativo) {
    await supabase.from('anos_letivos').update({ ativo: false }).neq('id', '0')
  }

  const { data: ano, error } = await supabase
    .from('anos_letivos')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/secretaria')
  return ano
}

export async function ativarAnoLetivo(id: string) {
  const supabase = await createSupabaseServer()
  await supabase.from('anos_letivos').update({ ativo: false }).neq('id', '0')
  await supabase.from('anos_letivos').update({ ativo: true }).eq('id', id)
  revalidatePath('/secretaria')
}
