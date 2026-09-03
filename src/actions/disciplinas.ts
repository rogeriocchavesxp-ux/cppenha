'use server'

import { createSupabaseServer } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function listarDisciplinas() {
  const sb = await createSupabaseServer()
  const { data, error } = await sb
    .from('disciplinas')
    .select('*')
    .order('nome')
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function criarDisciplina(data: {
  nome: string
  codigo?: string
  descricao?: string
}) {
  const sb = await createSupabaseServer()
  const { data: d, error } = await sb
    .from('disciplinas')
    .insert({ nome: data.nome, codigo: data.codigo || null, descricao: data.descricao || null })
    .select()
    .single()
  if (error) throw new Error(error.message)
  revalidatePath('/coordenacao/disciplinas')
  return d
}

export async function atualizarDisciplina(id: string, data: { nome?: string; codigo?: string; descricao?: string }) {
  const sb = await createSupabaseServer()
  const { error } = await sb.from('disciplinas').update(data).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/coordenacao/disciplinas')
}

export async function excluirDisciplina(id: string) {
  const sb = await createSupabaseServer()
  const { error } = await sb.from('disciplinas').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/coordenacao/disciplinas')
}
