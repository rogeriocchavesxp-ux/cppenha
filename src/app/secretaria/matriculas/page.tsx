import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MatriculaStatusMenu } from '@/components/secretaria/MatriculaStatusMenu'
import { listarMatriculas } from '@/actions/matriculas'
import { listarTurmas, listarAnosLetivos } from '@/actions/turmas'
import type { StatusMatricula } from '@/types'

const STATUS_BADGE: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  ativa: 'success', trancada: 'warning', cancelada: 'danger',
  concluida: 'default', transferida: 'default',
}
const STATUS_LABEL: Record<string, string> = {
  ativa: 'Ativa', trancada: 'Trancada', cancelada: 'Cancelada',
  concluida: 'Concluída', transferida: 'Transferida',
}
const TURNO_LABEL: Record<string, string> = { manha: 'Manhã', tarde: 'Tarde', integral: 'Integral' }

type Props = {
  searchParams: Promise<{
    status?: string
    turma?: string
    ano?: string
    busca?: string
  }>
}

export default async function MatriculasPage({ searchParams }: Props) {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const { status, turma, ano, busca } = await searchParams

  const [todasMatriculas, turmas, anos] = await Promise.all([
    listarMatriculas({
      status:      status  || undefined,
      turmaId:     turma   || undefined,
      anoLetivoId: ano     || undefined,
      busca:       busca   || undefined,
    }),
    listarTurmas(),
    listarAnosLetivos(),
  ])

  // KPIs
  const totalAtivas      = todasMatriculas.filter((m: any) => m.status === 'ativa').length
  const totalTrancadas   = todasMatriculas.filter((m: any) => m.status === 'trancada').length
  const totalCanceladas  = todasMatriculas.filter((m: any) => m.status === 'cancelada').length
  const totalConcluidas  = todasMatriculas.filter((m: any) => m.status === 'concluida').length

  const filtersActive = !!(status || turma || ano || busca)

  function buildQuery(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams()
    const merged = { status, turma, ano, busca, ...overrides }
    for (const [k, v] of Object.entries(merged)) {
      if (v) params.set(k, v)
    }
    const qs = params.toString()
    return `/secretaria/matriculas${qs ? '?' + qs : ''}`
  }

  const selectStyle = {
    background: 'var(--surface)',
    border: '1px solid var(--border-soft)',
    color: 'var(--text-primary)',
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: '13px',
    outline: 'none',
  } as const

  return (
    <AppShell
      papel={perfil.papel}
      nomeUsuario={perfil.nome}
      titulo="Matrículas"
      breadcrumb={[{ label: 'Secretaria', href: '/secretaria' }, { label: 'Matrículas' }]}
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Ativas',     valor: totalAtivas,    cor: 'var(--green-600)'  },
          { label: 'Trancadas',  valor: totalTrancadas, cor: 'var(--amber-500)'  },
          { label: 'Canceladas', valor: totalCanceladas,cor: 'var(--red-500)'    },
          { label: 'Concluídas', valor: totalConcluidas,cor: 'var(--text-muted)' },
        ].map(kpi => (
          <Card key={kpi.label} padding="md">
            <p className="text-2xl font-bold tabular-nums" style={{ color: kpi.cor }}>
              {kpi.valor}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{kpi.label}</p>
          </Card>
        ))}
      </div>

      {/* Filtros + ação */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <form method="GET" action="/secretaria/matriculas" className="flex flex-wrap gap-2 flex-1">
          <input
            name="busca"
            defaultValue={busca}
            placeholder="Buscar aluno..."
            style={{ ...selectStyle, minWidth: 180 }}
          />
          <select name="status" defaultValue={status ?? ''} style={selectStyle}>
            <option value="">Todos os status</option>
            {Object.entries(STATUS_LABEL).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <select name="turma" defaultValue={turma ?? ''} style={selectStyle}>
            <option value="">Todas as turmas</option>
            {turmas.map((t: any) => (
              <option key={t.id} value={t.id}>{t.nome}</option>
            ))}
          </select>
          <select name="ano" defaultValue={ano ?? ''} style={selectStyle}>
            <option value="">Todos os anos</option>
            {anos.map((a: any) => (
              <option key={a.id} value={a.id}>{a.ano}</option>
            ))}
          </select>
          <Button type="submit" size="sm" variant="secondary">Filtrar</Button>
          {filtersActive && (
            <Link href="/secretaria/matriculas">
              <Button size="sm" variant="secondary">Limpar</Button>
            </Link>
          )}
        </form>

        <Link href="/secretaria/matriculas/nova">
          <Button size="sm">+ Nova Matrícula</Button>
        </Link>
      </div>

      {/* Tabela */}
      <Card padding="none">
        {todasMatriculas.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {filtersActive ? 'Nenhuma matrícula encontrada com estes filtros.' : 'Nenhuma matrícula registrada.'}
            </p>
          </div>
        ) : (
          <>
            <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-soft)' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {todasMatriculas.length} resultado{todasMatriculas.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-soft)' }}>
                    {['Aluno', 'Turma', 'Turno', 'Ano', 'Data', 'Status', ''].map((h, i) => (
                      <th
                        key={i}
                        className="text-left px-5 py-3 text-xs font-semibold"
                        style={{ color: 'var(--text-muted)', width: h === '' ? 48 : undefined }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {todasMatriculas.map((m: any) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                      <td className="px-5 py-3">
                        <Link
                          href={`/secretaria/alunos/${m.alunos?.id}`}
                          className="font-medium hover:underline"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {m.alunos?.nome_completo}
                        </Link>
                        {m.alunos?.matricula && (
                          <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            #{m.alunos.matricula}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-3" style={{ color: 'var(--text-secondary)' }}>
                        {m.turmas?.nome}
                      </td>
                      <td className="px-5 py-3" style={{ color: 'var(--text-secondary)' }}>
                        {TURNO_LABEL[m.turmas?.turno] ?? '—'}
                      </td>
                      <td
                        className="px-5 py-3 tabular-nums"
                        style={{ color: 'var(--text-secondary)' }}
                      >
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
                      <td className="px-2 py-3">
                        <MatriculaStatusMenu
                          matriculaId={m.id}
                          statusAtual={m.status as StatusMatricula}
                          alunoHref={`/secretaria/alunos/${m.alunos?.id}`}
                          alunoNome={m.alunos?.nome_completo ?? ''}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </AppShell>
  )
}
