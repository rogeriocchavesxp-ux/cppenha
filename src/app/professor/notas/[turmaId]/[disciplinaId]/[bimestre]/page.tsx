import { redirect } from 'next/navigation'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { listarNotasDaTurma } from '@/actions/notas'
import { NotasGrid } from '@/components/professor/NotasGrid'
import { createSupabaseServer } from '@/lib/supabase-server'

type Props = { params: Promise<{ turmaId: string; disciplinaId: string; bimestre: string }> }

export default async function LancamentoNotasPage({ params }: Props) {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const { turmaId, disciplinaId, bimestre: bimestreStr } = await params
  const bimestre = parseInt(bimestreStr, 10)
  if (![1, 2, 3, 4].includes(bimestre)) redirect('/professor/notas')

  const sb = await createSupabaseServer()
  const [{ data: turma }, { data: disciplina }, alunos] = await Promise.all([
    sb.from('turmas').select('nome, serie').eq('id', turmaId).single(),
    sb.from('disciplinas').select('nome').eq('id', disciplinaId).single(),
    listarNotasDaTurma(turmaId, disciplinaId, bimestre),
  ])

  return (
    <AppShell
      papel={perfil.papel}
      nomeUsuario={perfil.nome}
      titulo={`${disciplina?.nome ?? 'Notas'} — ${bimestre}º Bimestre`}
      breadcrumb={[
        { label: 'Minhas Turmas', href: '/professor' },
        { label: 'Notas', href: '/professor/notas' },
        { label: `${turma?.nome} · ${disciplina?.nome} · ${bimestre}º Bim` },
      ]}
    >
      <div className="mb-4">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {turma?.nome} — {turma?.serie}
        </p>
      </div>

      {alunos.length === 0 ? (
        <Card>
          <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>
            Nenhum aluno matriculado nesta turma.
          </p>
        </Card>
      ) : (
        <NotasGrid
          alunos={alunos}
          disciplinaId={disciplinaId}
          bimestre={bimestre}
        />
      )}
    </AppShell>
  )
}
