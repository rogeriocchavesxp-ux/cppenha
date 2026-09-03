import { redirect } from 'next/navigation'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { MatriculaForm } from '@/components/secretaria/MatriculaForm'
import { listarAlunos } from '@/actions/alunos'
import { listarTurmas, listarAnosLetivos } from '@/actions/turmas'

type Props = { searchParams: Promise<{ aluno_id?: string }> }

export default async function NovaMatriculaPage({ searchParams }: Props) {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const { aluno_id } = await searchParams
  const [alunos, turmas, anos] = await Promise.all([
    listarAlunos(),
    listarTurmas(),
    listarAnosLetivos(),
  ])

  return (
    <AppShell
      papel={perfil.papel}
      nomeUsuario={perfil.nome}
      titulo="Nova Matrícula"
      breadcrumb={[
        { label: 'Secretaria', href: '/secretaria' },
        { label: 'Matrículas', href: '/secretaria/matriculas' },
        { label: 'Nova' },
      ]}
    >
      <div className="max-w-lg">
        <Card>
          <MatriculaForm alunos={alunos} turmas={turmas} anos={anos} alunoIdInicial={aluno_id} />
        </Card>
      </div>
    </AppShell>
  )
}
