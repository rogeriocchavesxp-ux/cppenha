import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { AlunoForm } from '@/components/secretaria/AlunoForm'
import { buscarAluno } from '@/actions/alunos'
import { listarMatriculasPorAluno } from '@/actions/matriculas'

const STATUS_BADGE: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  ativa: 'success', trancada: 'warning', cancelada: 'danger',
  concluida: 'default', transferida: 'default',
}
const STATUS_LABEL: Record<string, string> = {
  ativa: 'Ativa', trancada: 'Trancada', cancelada: 'Cancelada',
  concluida: 'Concluída', transferida: 'Transferida',
}

type Props = { params: Promise<{ id: string }> }

export default async function AlunoPage({ params }: Props) {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const { id } = await params
  const [aluno, matriculas] = await Promise.all([
    buscarAluno(id).catch(() => null),
    listarMatriculasPorAluno(id),
  ])

  if (!aluno) notFound()

  return (
    <AppShell
      papel={perfil.papel}
      nomeUsuario={perfil.nome}
      titulo={aluno.nome_completo}
      breadcrumb={[
        { label: 'Secretaria', href: '/secretaria' },
        { label: 'Alunos', href: '/secretaria/alunos' },
        { label: aluno.nome_completo },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de edição */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Dados do Aluno
              </h2>
              <Badge variant={aluno.ativo ? 'success' : 'default'}>
                {aluno.ativo ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
            <AlunoForm aluno={aluno} />
          </Card>
        </div>

        {/* Matrículas */}
        <div className="flex flex-col gap-4">
          <Card padding="none">
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid var(--border-soft)' }}
            >
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Matrículas
              </h2>
              <Link href={`/secretaria/matriculas/nova?aluno_id=${id}`}>
                <Button size="sm" variant="secondary">+ Matricular</Button>
              </Link>
            </div>

            {matriculas.length === 0 ? (
              <p className="px-5 py-6 text-sm text-center" style={{ color: 'var(--text-muted)' }}>
                Sem matrículas.
              </p>
            ) : (
              <div className="divide-y" style={{ borderColor: 'var(--border-soft)' }}>
                {matriculas.map((m: any) => (
                  <div key={m.id} className="px-5 py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {m.turmas?.nome}
                      </p>
                      <Badge variant={STATUS_BADGE[m.status] ?? 'default'}>
                        {STATUS_LABEL[m.status] ?? m.status}
                      </Badge>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {m.anos_letivos?.ano} · {m.turmas?.serie}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
