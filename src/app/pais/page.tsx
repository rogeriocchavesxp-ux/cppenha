import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { listarMeusFilhos } from '@/actions/responsaveis'
import { listarComunicados } from '@/actions/comunicados'

const TURNO_LABEL: Record<string, string> = { manha: 'Manhã', tarde: 'Tarde', integral: 'Integral' }
const MES_LABEL = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export default async function PaisPage() {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const [filhos, comunicados] = await Promise.all([
    listarMeusFilhos().catch(() => []),
    listarComunicados(5).catch(() => []),
  ])

  return (
    <AppShell papel={perfil.papel} nomeUsuario={perfil.nome} titulo="Início">
      {filhos.length === 0 ? (
        <Card>
          <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>
            Nenhum filho vinculado à sua conta. Contate a secretaria.
          </p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {filhos.map((r: any) => {
              const aluno = r.alunos
              const matriculaAtiva = (aluno?.matriculas ?? []).find(
                (m: any) => m.status === 'ativa' && m.anos_letivos?.ativo
              )
              return (
                <Card key={r.id}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {aluno?.nome_completo}
                      </h2>
                      <p className="text-xs mt-0.5 capitalize" style={{ color: 'var(--text-muted)' }}>
                        {r.parentesco}
                        {aluno?.matricula ? ` · Matrícula ${aluno.matricula}` : ''}
                      </p>
                    </div>
                    <Badge variant={aluno?.ativo ? 'success' : 'default'}>
                      {aluno?.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>

                  {matriculaAtiva ? (
                    <div
                      className="rounded-lg px-4 py-3 mb-4 text-sm"
                      style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-soft)' }}
                    >
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {matriculaAtiva.turmas?.nome}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {matriculaAtiva.turmas?.serie} · {TURNO_LABEL[matriculaAtiva.turmas?.turno] ?? ''} · {matriculaAtiva.anos_letivos?.ano}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                      Sem matrícula ativa no ano corrente.
                    </p>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <Link
                      href={`/pais/boletim?aluno=${aluno?.id}`}
                      className="text-xs font-medium px-3 py-2 rounded-md text-center"
                      style={{ background: 'var(--navy-900)', color: '#fff' }}
                    >
                      Boletim
                    </Link>
                    <Link
                      href={`/pais/frequencia?aluno=${aluno?.id}`}
                      className="text-xs font-medium px-3 py-2 rounded-md text-center"
                      style={{ background: 'var(--surface-raised)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                    >
                      Frequência
                    </Link>
                    <Link
                      href={`/pais/financeiro?aluno=${aluno?.id}`}
                      className="text-xs font-medium px-3 py-2 rounded-md text-center"
                      style={{ background: 'var(--surface-raised)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                    >
                      Financeiro
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Últimos comunicados */}
          {comunicados.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Comunicados Recentes
                </h2>
                <Link href="/comunicados" className="text-xs" style={{ color: 'var(--navy-500)' }}>
                  Ver todos
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                {comunicados.map((c: any) => (
                  <Card key={c.id} padding="sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                          {c.titulo}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {c.perfis?.nome} · {new Date(c.publicado_em).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      {c.turmas && (
                        <Badge variant="info">{c.turmas.nome}</Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </AppShell>
  )
}
