import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { AlunoForm } from '@/components/secretaria/AlunoForm'
import { ResponsaveisSection } from '@/components/secretaria/ResponsaveisSection'
import { buscarAluno } from '@/actions/alunos'
import { listarMatriculasPorAluno } from '@/actions/matriculas'
import { listarResponsaveisPorAluno } from '@/actions/responsaveis'

const STATUS_BADGE: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  ativa: 'success', trancada: 'warning', cancelada: 'danger',
  concluida: 'default', transferida: 'default',
}
const STATUS_LABEL: Record<string, string> = {
  ativa: 'Ativa', trancada: 'Trancada', cancelada: 'Cancelada',
  concluida: 'Concluída', transferida: 'Transferida',
}
const TURNO_LABEL: Record<string, string> = { manha: 'Manhã', tarde: 'Tarde', integral: 'Integral' }

type Props = { params: Promise<{ id: string }> }

export default async function AlunoPage({ params }: Props) {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const { id } = await params
  const [aluno, matriculas, responsaveis] = await Promise.all([
    buscarAluno(id).catch(() => null),
    listarMatriculasPorAluno(id),
    listarResponsaveisPorAluno(id),
  ])

  if (!aluno) notFound()

  const matriculaAtiva = matriculas.find((m: any) => m.status === 'ativa')

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
      <div className="flex flex-col gap-6">

        {/* ── Linha 1: dados + situação atual ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Dados do aluno */}
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

          {/* Situação atual */}
          <div className="flex flex-col gap-4">
            <Card padding="none">
              <div
                className="px-5 py-4"
                style={{ borderBottom: '1px solid var(--border-soft)' }}
              >
                <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Situação Atual
                </h2>
              </div>
              {matriculaAtiva ? (
                <div className="px-5 py-4 flex flex-col gap-3">
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>TURMA</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {(matriculaAtiva as any).turmas?.nome}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {(matriculaAtiva as any).turmas?.serie} · {TURNO_LABEL[(matriculaAtiva as any).turmas?.turno] ?? '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>ANO LETIVO</p>
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      {(matriculaAtiva as any).anos_letivos?.ano}
                    </p>
                  </div>
                  <Badge variant="success">Matrícula ativa</Badge>
                </div>
              ) : (
                <div className="px-5 py-6 text-center flex flex-col items-center gap-3">
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Sem matrícula ativa.
                  </p>
                  <Link href={`/secretaria/matriculas/nova?aluno_id=${id}`}>
                    <Button size="sm">+ Matricular</Button>
                  </Link>
                </div>
              )}
            </Card>

            {/* Matrícula — código */}
            {aluno.matricula && (
              <Card padding="sm">
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                  CÓDIGO DE MATRÍCULA
                </p>
                <p className="text-sm font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {aluno.matricula}
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* ── Linha 2: responsáveis ── */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Responsáveis
            </h2>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {responsaveis.length} cadastrado{responsaveis.length !== 1 ? 's' : ''}
            </span>
          </div>
          <ResponsaveisSection alunoId={id} responsaveis={responsaveis} />
        </Card>

        {/* ── Linha 3: histórico de matrículas ── */}
        <Card padding="none">
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid var(--border-soft)' }}
          >
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Histórico de Matrículas
            </h2>
            <Link href={`/secretaria/matriculas/nova?aluno_id=${id}`}>
              <Button size="sm" variant="secondary">+ Matricular</Button>
            </Link>
          </div>

          {matriculas.length === 0 ? (
            <p className="px-5 py-8 text-sm text-center" style={{ color: 'var(--text-muted)' }}>
              Nenhuma matrícula registrada.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-soft)' }}>
                    {['Turma', 'Série', 'Turno', 'Ano Letivo', 'Data', 'Status'].map(h => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-semibold"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matriculas.map((m: any) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                      <td className="px-5 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                        {m.turmas?.nome}
                      </td>
                      <td className="px-5 py-3" style={{ color: 'var(--text-secondary)' }}>
                        {m.turmas?.serie}
                      </td>
                      <td className="px-5 py-3" style={{ color: 'var(--text-secondary)' }}>
                        {TURNO_LABEL[m.turmas?.turno] ?? '—'}
                      </td>
                      <td className="px-5 py-3 tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                        {m.anos_letivos?.ano}
                      </td>
                      <td className="px-5 py-3" style={{ color: 'var(--text-secondary)' }}>
                        {new Date(m.data_matricula).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={STATUS_BADGE[m.status] ?? 'default'}>
                          {STATUS_LABEL[m.status] ?? m.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

      </div>
    </AppShell>
  )
}
