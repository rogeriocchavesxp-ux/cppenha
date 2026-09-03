import { redirect } from 'next/navigation'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { listarChamadaDoDia } from '@/actions/frequencias'
import { ChamadaGrid } from '@/components/professor/ChamadaGrid'
import { ChamadaDatePicker } from '@/components/professor/ChamadaDatePicker'
import { createSupabaseServer } from '@/lib/supabase-server'

type Props = {
  params: Promise<{ turmaId: string; disciplinaId: string }>
  searchParams: Promise<{ data?: string }>
}

export default async function ChamadaDoDiaPage({ params, searchParams }: Props) {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const { turmaId, disciplinaId } = await params
  const { data: dataParam } = await searchParams
  const data = dataParam ?? new Date().toISOString().split('T')[0]

  const sb = await createSupabaseServer()
  const [{ data: turma }, { data: disciplina }, alunos] = await Promise.all([
    sb.from('turmas').select('nome, serie').eq('id', turmaId).single(),
    sb.from('disciplinas').select('nome').eq('id', disciplinaId).single(),
    listarChamadaDoDia(turmaId, disciplinaId, data),
  ])

  const dataFormatada = new Date(data + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <AppShell
      papel={perfil.papel}
      nomeUsuario={perfil.nome}
      titulo={`Chamada — ${disciplina?.nome ?? ''}`}
      breadcrumb={[
        { label: 'Minhas Turmas', href: '/professor' },
        { label: 'Chamada', href: '/professor/chamada' },
        { label: `${turma?.nome} · ${disciplina?.nome}` },
      ]}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {turma?.nome} — {turma?.serie}
          </p>
          <p className="text-xs capitalize mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {dataFormatada}
          </p>
        </div>
        <ChamadaDatePicker turmaId={turmaId} disciplinaId={disciplinaId} dataAtual={data} />
      </div>

      {alunos.length === 0 ? (
        <Card>
          <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>
            Nenhum aluno matriculado nesta turma.
          </p>
        </Card>
      ) : (
        <ChamadaGrid
          alunos={alunos}
          disciplinaId={disciplinaId}
          data={data}
        />
      )}
    </AppShell>
  )
}
