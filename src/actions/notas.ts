'use server'

import { createSupabaseServer, getSession } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function listarNotasDaTurma(turmaId: string, disciplinaId: string, bimestre: number) {
  const sb = await createSupabaseServer()

  const [{ data: matriculas, error: errM }, { data: notas, error: errN }] = await Promise.all([
    sb
      .from('matriculas')
      .select('id, alunos ( id, nome_completo, matricula )')
      .eq('turma_id', turmaId)
      .eq('status', 'ativa'),
    sb
      .from('notas')
      .select('id, matricula_id, bimestre, nota, recuperacao, observacao')
      .eq('disciplina_id', disciplinaId)
      .eq('bimestre', bimestre),
  ])

  if (errM) throw new Error(errM.message)
  if (errN) throw new Error(errN.message)

  const notaMap = new Map((notas ?? []).map((n: any) => [n.matricula_id, n]))

  return (matriculas ?? [])
    .map((m: any) => ({
      matricula_id: m.id,
      aluno:        m.alunos,
      nota:         notaMap.get(m.id) ?? null,
    }))
    .sort((a: any, b: any) =>
      (a.aluno?.nome_completo ?? '').localeCompare(b.aluno?.nome_completo ?? '', 'pt-BR')
    )
}

export async function listarNotasPorMatricula(matriculaId: string) {
  const sb = await createSupabaseServer()
  const { data, error } = await sb
    .from('notas')
    .select('*, disciplinas ( id, nome )')
    .eq('matricula_id', matriculaId)
    .order('bimestre')
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function salvarNota(data: {
  matricula_id: string
  disciplina_id: string
  bimestre: number
  nota?: number | null
  recuperacao?: number | null
  observacao?: string | null
}) {
  const sb = await createSupabaseServer()
  const session = await getSession()
  const lancado_por = session?.user?.id ?? null

  const { error } = await sb
    .from('notas')
    .upsert(
      {
        matricula_id:  data.matricula_id,
        disciplina_id: data.disciplina_id,
        bimestre:      data.bimestre,
        nota:          data.nota ?? null,
        recuperacao:   data.recuperacao ?? null,
        observacao:    data.observacao ?? null,
        lancado_por,
        atualizado_em: new Date().toISOString(),
      },
      { onConflict: 'matricula_id,disciplina_id,bimestre' }
    )
  if (error) throw new Error(error.message)
  revalidatePath('/professor/notas')
}
