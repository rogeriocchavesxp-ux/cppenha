import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { listarMeusFilhos, frequenciaDoAluno } from '@/actions/responsaveis'

type Props = { searchParams: Promise<{ aluno?: string }> }

export default async function FrequenciaPage({ searchParams }: Props) {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const { aluno: alunoId } = await searchParams
  const filhos = await listarMeusFilhos().catch(() => [])
  if (filhos.length === 0) redirect('/pais')

  const alunoSelecionado = alunoId
    ? (filhos.find((r: any) => r.alunos?.id === alunoId) as any)
    : (filhos[0] as any)
  if (!alunoSelecionado) redirect('/pais')

  const { total, presentes, ausentes, registros } = await frequenciaDoAluno(
    alunoSelecionado.alunos.id
  ).catch(() => ({ total: 0, presentes: 0, ausentes: 0, registros: [] }))

  const pct = total > 0 ? Math.round((presentes / total) * 100) : null

  return (
    <AppShell
      papel={perfil.papel}
      nomeUsuario={perfil.nome}
      titulo="Frequência"
      breadcrumb={[{ label: 'Início', href: '/pais' }, { label: 'Frequência' }]}
    >
      {/* Seletor de filho */}
      {filhos.length > 1 && (
        <div className="flex gap-2 mb-5 flex-wrap">
          {filhos.map((r: any) => (
            <Link
              key={r.id}
              href={`/pais/frequencia?aluno=${r.alunos?.id}`}
              className="text-xs font-medium px-4 py-2 rounded-full transition-colors"
              style={{
                background: r.alunos?.id === alunoSelecionado.alunos?.id ? 'var(--navy-900)' : 'var(--surface-raised)',
                color:      r.alunos?.id === alunoSelecionado.alunos?.id ? '#fff' : 'var(--text-primary)',
                border:     '1px solid var(--border)',
              }}
            >
              {r.alunos?.nome_completo}
            </Link>
          ))}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Aulas
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
            {total}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Presenças
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: 'var(--green-600)', fontVariantNumeric: 'tabular-nums' }}>
            {presentes}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Frequência
          </p>
          <p
            className="text-3xl font-bold mt-1"
            style={{
              color: pct === null ? 'var(--text-muted)' : pct >= 75 ? 'var(--green-600)' : pct >= 60 ? 'var(--amber-600)' : 'var(--red-600)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {pct !== null ? `${pct}%` : '—'}
          </p>
        </Card>
      </div>

      {/* Barra de progresso */}
      {pct !== null && (
        <div className="mb-6">
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border-soft)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${pct}%`,
                background: pct >= 75 ? 'var(--green-600)' : pct >= 60 ? 'var(--amber-600)' : 'var(--red-600)',
              }}
            />
          </div>
          <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
            Mínimo exigido: 75% de presença
          </p>
        </div>
      )}

      {/* Histórico */}
      {registros.length > 0 ? (
        <Card padding="none">
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Histórico de Chamadas
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--surface-raised)', borderBottom: '1px solid var(--border-soft)' }}>
                  {['Data', 'Disciplina', 'Situação'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {registros.map((f: any, i: number) => (
                  <tr
                    key={i}
                    style={{ borderBottom: i < registros.length - 1 ? '1px solid var(--border-soft)' : 'none' }}
                  >
                    <td className="px-5 py-2.5" style={{ color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                      {new Date(f.data + 'T12:00:00').toLocaleDateString('pt-BR', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-2.5" style={{ color: 'var(--text-secondary)' }}>
                      {f.disciplinas?.nome ?? '—'}
                    </td>
                    <td className="px-5 py-2.5">
                      <Badge variant={f.presente ? 'success' : f.justificada ? 'warning' : 'danger'}>
                        {f.presente ? 'Presente' : f.justificada ? 'Falta Justificada' : 'Ausente'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card>
          <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>
            Nenhum registro de chamada ainda.
          </p>
        </Card>
      )}
    </AppShell>
  )
}
