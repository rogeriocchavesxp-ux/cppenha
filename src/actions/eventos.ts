'use server'

import { createSupabaseServer } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function listarEventos(ano: number, mes: number) {
  const sb = await createSupabaseServer()
  const inicio = `${ano}-${String(mes).padStart(2, '0')}-01`
  const fim = new Date(ano, mes, 0).toISOString().slice(0, 10) // último dia do mês

  const { data, error } = await sb
    .from('eventos')
    .select('*, perfis(nome)')
    .gte('inicio', inicio)
    .lte('inicio', fim + 'T23:59:59')
    .order('inicio')

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function criarEvento(payload: {
  titulo: string
  descricao?: string
  inicio: string
  termino?: string
  dia_todo: boolean
  tipo: string
  turma_id?: string
}) {
  const sb = await createSupabaseServer()
  const { data: { session } } = await sb.auth.getSession()

  const { error } = await sb.from('eventos').insert({
    ...payload,
    descricao: payload.descricao || null,
    termino: payload.termino || null,
    turma_id: payload.turma_id || null,
    criado_por: session?.user.id ?? null,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/calendario')
}

export async function excluirEvento(id: string) {
  const sb = await createSupabaseServer()
  const { error } = await sb.from('eventos').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/calendario')
}
