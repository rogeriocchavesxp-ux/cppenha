'use server'

import { createSupabaseServer } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function listarAtribuicoesDoprofessor() {
  const sb = await createSupabaseServer()
  const { data, error } = await sb
    .from('atribuicoes')
    .select(`
      *,
      turmas ( id, nome, serie, turno, nivel, capacidade, ano_letivo_id ),
      disciplinas ( id, nome, codigo ),
      anos_letivos ( id, ano, ativo )
    `)
    .order('criado_em', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function listarAtribuicoesDaTurma(turmaId: string) {
  const sb = await createSupabaseServer()
  const { data, error } = await sb
    .from('atribuicoes')
    .select(`
      *,
      disciplinas ( id, nome, codigo ),
      perfis ( id, nome )
    `)
    .eq('turma_id', turmaId)
    .order('criado_em', { ascending: true })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function criarAtribuicao(data: {
  perfil_id: string
  turma_id: string
  disciplina_id: string
  ano_letivo_id: string
}) {
  const sb = await createSupabaseServer()
  const { data: d, error } = await sb
    .from('atribuicoes')
    .insert(data)
    .select()
    .single()
  if (error) throw new Error(error.message)
  revalidatePath('/coordenacao')
  return d
}

export async function removerAtribuicao(id: string) {
  const sb = await createSupabaseServer()
  const { error } = await sb.from('atribuicoes').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/coordenacao')
}
