import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { listarMeusFilhos, mensalidadesDoAluno } from '@/actions/responsaveis'

type Props = { searchParams: Promise<{ aluno?: string }> }

const STATUS_BADGE: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  pago: 'success', pendente: 'warning', atrasado: 'danger', isento: 'default', cancelado: 'default',
}
const STATUS_LABEL: Record<string, string> = {
  pago: 'Pago', pendente: 'Pendente', atrasado: 'Atrasado', isento: 'Isento', cancelado: 'Cancelado',
}
const MES_LABEL = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

function fmt(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default async function FinanceiroPage({ searchParams }: Props) {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const { aluno: alunoId } = await searchParams
  const filhos = await listarMeusFilhos().catch(() => [])
  if (filhos.length === 0) redirect('/pais')

  const alunoSelecionado = alunoId
    ? (filhos.find((r: any) => r.alunos?.id === alunoId) as any)
    : (filhos[0] as any)
  if (!alunoSelecionado) redirect('/pais')

  const mensalidades = await mensalidadesDoAluno(alunoSelecionado.alunos.id).catch(() => [])

  const totalPago     = mensalidades.filter((m: any) => m.status === 'pago').length
  const totalPendente = mensalidades.filter((m: any) => ['pendente', 'atrasado'].includes(m.status)).length
  const valorPendente = mensalidades
    .filter((m: any) => ['pendente', 'atrasado'].includes(m.status))
    .reduce((acc: number, m: any) => acc + (m.valor ?? 0), 0)

  return (
    <AppShell
      papel={perfil.papel}
      nomeUsuario={perfil.nome}
      titulo="Financeiro"
      breadcrumb={[{ label: 'Início', href: '/pais' }, { label: 'Financeiro' }]}
    >
      {/* Seletor de filho */}
      {filhos.length > 1 && (
        <div className="flex gap-2 mb-5 flex-wrap">
          {filhos.map((r: any) => (
            <Link
              key={r.id}
              href={`/pais/financeiro?aluno=${r.alunos?.id}`}
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
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Pagas</p>
          <p className="text-3xl font-bold mt-1" style={{ color: 'var(--green-600)', fontVariantNumeric: 'tabular-nums' }}>
            {totalPago}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Pendentes</p>
          <p className="text-3xl font-bold mt-1" style={{ color: totalPendente > 0 ? 'var(--red-600)' : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
            {totalPendente}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Em Aberto</p>
          <p className="text-2xl font-bold mt-1" style={{ color: valorPendente > 0 ? 'var(--red-600)' : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
            {fmt(valorPendente)}
          </p>
        </Card>
      </div>

      {/* Tabela de mensalidades */}
      {mensalidades.length > 0 ? (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--surface-raised)', borderBottom: '1px solid var(--border-soft)' }}>
                  {['Mês', 'Valor', 'Vencimento', 'Pago em', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mensalidades.map((m: any, i: number) => (
                  <tr
                    key={m.id}
                    style={{ borderBottom: i < mensalidades.length - 1 ? '1px solid var(--border-soft)' : 'none' }}
                  >
                    <td className="px-5 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                      {MES_LABEL[m.mes]}
                    </td>
                    <td className="px-5 py-3" style={{ color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                      {fmt(m.valor)}
                    </td>
                    <td className="px-5 py-3" style={{ color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                      {new Date(m.vencimento + 'T12:00:00').toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-5 py-3" style={{ color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                      {m.pago_em ? new Date(m.pago_em + 'T12:00:00').toLocaleDateString('pt-BR') : '—'}
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
        </Card>
      ) : (
        <Card>
          <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>
            Nenhuma mensalidade registrada.
          </p>
        </Card>
      )}
    </AppShell>
  )
}
