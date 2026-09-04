'use server'

import { createSupabaseServer } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import type { Papel } from '@/types'

export async function listarColaboradores() {
  const sb = await createSupabaseServer()
  const { data, error } = await sb
    .from('perfis')
    .select('*')
    .neq('papel', 'pai')
    .order('nome')

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function atualizarColaborador(id: string, payload: {
  nome?: string
  telefone?: string
  papel?: Papel
  ativo?: boolean
}) {
  const sb = await createSupabaseServer()
  const { error } = await sb
    .from('perfis')
    .update({ ...payload, atualizado_em: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/colaboradores')
}

export async function alternarAtivo(id: string, ativo: boolean) {
  const sb = await createSupabaseServer()
  const { error } = await sb
    .from('perfis')
    .update({ ativo, atualizado_em: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/colaboradores')
}
