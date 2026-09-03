'use server'

import { createSupabaseServer } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import type { StatusMatricula } from '@/types'

export async function criarMatricula(data: {
  aluno_id: string
  turma_id: string
  ano_letivo_id: string
}) {
  const supabase = await createSupabaseServer()
  const { data: matricula, error } = await supabase
    .from('matriculas')
    .insert({ ...data, status: 'ativa', data_matricula: new Date().toISOString().split('T')[0] })
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/secretaria/matriculas')
  revalidatePath('/secretaria')
  return matricula
}

export async function atualizarStatusMatricula(id: string, status: StatusMatricula) {
  const supabase = await createSupabaseServer()
  const { error } = await supabase.from('matriculas').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/secretaria/matriculas')
}

export async function listarMatriculas(anoLetivoId?: string) {
  const supabase = await createSupabaseServer()
  let query = supabase
    .from('matriculas')
    .select(`
      *,
      alunos(id, nome_completo, matricula),
      turmas(id, nome, serie, turno),
      anos_letivos(ano)
    `)
    .order('criado_em', { ascending: false })

  if (anoLetivoId) query = query.eq('ano_letivo_id', anoLetivoId)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function listarMatriculasPorAluno(alunoId: string) {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('matriculas')
    .select('*, turmas(nome, serie), anos_letivos(ano)')
    .eq('aluno_id', alunoId)
    .order('criado_em', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}
