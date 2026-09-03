'use server'

import { createSupabaseServer } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function criarAluno(data: {
  nome_completo: string
  data_nascimento: string
  cpf?: string
  matricula?: string
}) {
  const supabase = await createSupabaseServer()
  const { data: aluno, error } = await supabase
    .from('alunos')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/secretaria/alunos')
  return aluno
}

export async function atualizarAluno(id: string, data: {
  nome_completo?: string
  data_nascimento?: string
  cpf?: string
  matricula?: string
  ativo?: boolean
}) {
  const supabase = await createSupabaseServer()
  const { error } = await supabase
    .from('alunos')
    .update({ ...data, atualizado_em: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/secretaria/alunos')
}

export async function desativarAluno(id: string) {
  await atualizarAluno(id, { ativo: false })
}

export async function listarAlunos(busca?: string) {
  const supabase = await createSupabaseServer()
  let query = supabase
    .from('alunos')
    .select('*')
    .order('nome_completo')

  if (busca) {
    query = query.ilike('nome_completo', `%${busca}%`)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function buscarAluno(id: string) {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('alunos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}
