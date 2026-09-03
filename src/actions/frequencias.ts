'use server'

import { createSupabaseServer, getSession } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function listarChamadaDoDia(turmaId: string, disciplinaId: string, data: string) {
  const sb = await createSupabaseServer()

  const [{ data: matriculas, error: errM }, { data: freqs, error: errF }] = await Promise.all([
    sb
      .from('matriculas')
      .select('id, alunos ( id, nome_completo, matricula )')
      .eq('turma_id', turmaId)
      .eq('status', 'ativa'),
    sb
      .from('frequencias')
      .select('id, matricula_id, data, presente, justificada, observacao')
      .eq('disciplina_id', disciplinaId)
      .eq('data', data),
  ])

  if (errM) throw new Error(errM.message)
  if (errF) throw new Error(errF.message)

  const freqMap = new Map((freqs ?? []).map((f: any) => [f.matricula_id, f]))

  return (matriculas ?? [])
    .map((m: any) => ({
      matricula_id: m.id,
      aluno:        m.alunos,
      frequencia:   freqMap.get(m.id) ?? null,
    }))
    .sort((a: any, b: any) =>
      (a.aluno?.nome_completo ?? '').localeCompare(b.aluno?.nome_completo ?? '', 'pt-BR')
    )
}

export async function listarFrequenciasPorMatricula(matriculaId: string, disciplinaId?: string) {
  const sb = await createSupabaseServer()
  let q = sb
    .from('frequencias')
    .select('*, disciplinas ( id, nome )')
    .eq('matricula_id', matriculaId)
    .order('data', { ascending: false })
  if (disciplinaId) q = q.eq('disciplina_id', disciplinaId)
  const { data, error } = await q
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function salvarPresenca(data: {
  matricula_id: string
  disciplina_id: string
  data: string
  presente: boolean
  justificada?: boolean
  observacao?: string | null
}) {
  const sb = await createSupabaseServer()
  const session = await getSession()
  const lancado_por = session?.user?.id ?? null

  const { error } = await sb
    .from('frequencias')
    .upsert(
      {
        matricula_id:  data.matricula_id,
        disciplina_id: data.disciplina_id,
        data:          data.data,
        presente:      data.presente,
        justificada:   data.justificada ?? false,
        observacao:    data.observacao ?? null,
        lancado_por,
      },
      { onConflict: 'matricula_id,disciplina_id,data' }
    )
  if (error) throw new Error(error.message)
  revalidatePath('/professor/chamada')
}
