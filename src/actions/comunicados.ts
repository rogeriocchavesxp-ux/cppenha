'use server'

import { createSupabaseServer, getSession } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function listarComunicados(limit = 30) {
  const sb = await createSupabaseServer()
  const { data, error } = await sb
    .from('comunicados')
    .select('*, perfis ( nome ), turmas ( nome )')
    .order('publicado_em', { ascending: false })
    .limit(limit)
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function criarComunicado(data: {
  titulo: string
  conteudo: string
  destino: 'todos' | 'turma' | 'aluno' | 'colaboradores'
  turma_id?: string
  aluno_id?: string
}) {
  const sb = await createSupabaseServer()
  const session = await getSession()

  const { data: d, error } = await sb
    .from('comunicados')
    .insert({
      titulo:       data.titulo,
      conteudo:     data.conteudo,
      destino:      data.destino,
      turma_id:     data.turma_id ?? null,
      aluno_id:     data.aluno_id ?? null,
      publicado_por: session?.user?.id ?? null,
      publicado_em: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/comunicados')
  return d
}

export async function excluirComunicado(id: string) {
  const sb = await createSupabaseServer()
  const { error } = await sb.from('comunicados').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/comunicados')
}
