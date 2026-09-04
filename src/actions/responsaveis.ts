'use server'

import { createSupabaseServer, getSession } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

// ── Portal dos pais ──────────────────────────────────────────────────────────

export async function listarMeusFilhos() {
  const sb = await createSupabaseServer()
  const session = await getSession()
  if (!session?.user?.id) throw new Error('Não autenticado')

  const { data, error } = await sb
    .from('responsaveis')
    .select(`
      id, parentesco, financeiro,
      alunos (
        id, nome_completo, data_nascimento, matricula, ativo,
        matriculas (
          id, status, ano_letivo_id,
          turmas ( id, nome, serie, turno ),
          anos_letivos ( id, ano, ativo )
        )
      )
    `)
    .eq('perfil_id', session.user.id)
    .order('criado_em')

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function boletimDoAluno(alunoId: string) {
  const sb = await createSupabaseServer()
  const session = await getSession()
  if (!session?.user?.id) throw new Error('Não autenticado')

  const { data: resp } = await sb
    .from('responsaveis')
    .select('id')
    .eq('perfil_id', session.user.id)
    .eq('aluno_id', alunoId)
    .single()
  if (!resp) throw new Error('Acesso negado')

  const { data: matricula } = await sb
    .from('matriculas')
    .select('id, turmas ( nome, serie ), anos_letivos ( ano, ativo )')
    .eq('aluno_id', alunoId)
    .eq('status', 'ativa')
    .order('criado_em', { ascending: false })
    .limit(1)
    .single()

  if (!matricula) return { matricula: null, notas: [] }

  const { data: notas, error } = await sb
    .from('notas')
    .select('bimestre, nota, recuperacao, disciplinas ( nome )')
    .eq('matricula_id', matricula.id)
    .order('bimestre')

  if (error) throw new Error(error.message)
  return { matricula, notas: notas ?? [] }
}

export async function frequenciaDoAluno(alunoId: string) {
  const sb = await createSupabaseServer()
  const session = await getSession()
  if (!session?.user?.id) throw new Error('Não autenticado')

  const { data: resp } = await sb
    .from('responsaveis')
    .select('id')
    .eq('perfil_id', session.user.id)
    .eq('aluno_id', alunoId)
    .single()
  if (!resp) throw new Error('Acesso negado')

  const { data: matricula } = await sb
    .from('matriculas')
    .select('id')
    .eq('aluno_id', alunoId)
    .eq('status', 'ativa')
    .limit(1)
    .single()

  if (!matricula) return { total: 0, presentes: 0, ausentes: 0, registros: [] }

  const { data: freqs, error } = await sb
    .from('frequencias')
    .select('data, presente, justificada, disciplinas ( nome )')
    .eq('matricula_id', matricula.id)
    .order('data', { ascending: false })

  if (error) throw new Error(error.message)

  const registros = freqs ?? []
  const total     = registros.length
  const presentes = registros.filter(f => f.presente).length
  return { total, presentes, ausentes: total - presentes, registros }
}

export async function mensalidadesDoAluno(alunoId: string) {
  const sb = await createSupabaseServer()
  const session = await getSession()
  if (!session?.user?.id) throw new Error('Não autenticado')

  const { data: resp } = await sb
    .from('responsaveis')
    .select('id')
    .eq('perfil_id', session.user.id)
    .eq('aluno_id', alunoId)
    .single()
  if (!resp) throw new Error('Acesso negado')

  const { data, error } = await sb
    .from('mensalidades')
    .select('*')
    .eq('aluno_id', alunoId)
    .order('mes')

  if (error) throw new Error(error.message)
  return data ?? []
}

// ── Secretaria: CRUD de responsáveis ────────────────────────────────────────

export async function listarResponsaveisPorAluno(alunoId: string) {
  const sb = await createSupabaseServer()
  const { data, error } = await sb
    .from('responsaveis')
    .select('id, nome, telefone, email, parentesco, financeiro, perfil_id, criado_em')
    .eq('aluno_id', alunoId)
    .order('financeiro', { ascending: false })
    .order('criado_em')

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function criarResponsavel(payload: {
  aluno_id: string
  nome: string
  parentesco: string
  telefone?: string
  email?: string
  financeiro: boolean
}) {
  const sb = await createSupabaseServer()
  const { error } = await sb.from('responsaveis').insert({
    aluno_id:   payload.aluno_id,
    nome:       payload.nome,
    parentesco: payload.parentesco,
    telefone:   payload.telefone || null,
    email:      payload.email    || null,
    financeiro: payload.financeiro,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/secretaria/alunos')
}

export async function atualizarResponsavel(id: string, payload: {
  nome?: string
  parentesco?: string
  telefone?: string
  email?: string
  financeiro?: boolean
}) {
  const sb = await createSupabaseServer()
  const { error } = await sb.from('responsaveis').update(payload).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/secretaria/alunos')
}

export async function removerResponsavel(id: string) {
  const sb = await createSupabaseServer()
  const { error } = await sb.from('responsaveis').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/secretaria/alunos')
}
