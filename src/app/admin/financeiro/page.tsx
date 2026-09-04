import { redirect } from 'next/navigation'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { listarMensalidades, resumoFinanceiro, atualizarAtrasadas } from '@/actions/mensalidades'
import { listarAnosLetivos } from '@/actions/turmas'
import { GerarMensalidadesForm } from '@/components/financeiro/GerarMensalidadesForm'
import { RegistrarPagamentoBtn } from '@/components/financeiro/RegistrarPagamentoBtn'

type Props = { searchParams: Promise<{ status?: string; anoLetivoId?: string; acao?: string }> }

const STATUS_BADGE: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  pago: 'success', pendente: 'warning', atrasado: 'danger', isento: 'default', cancelado: 'default',
}
const STATUS_LABEL: Record<string, string> = {
  pago: 'Pago', pendente: 'Pendente', atrasado: 'Atrasado', isento: 'Isento', cancelado: 'Cancelado',
}
const MES_LABEL = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default async function FinanceiroAdminPage({ searchParams }: Props) {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const { status, anoLetivoId, acao } = await searchParams

  // atualiza automaticamente pendentes vencidas ao carregar a página
  await atualizarAtrasadas().catch(() => {})

  const [mensalidades, resumo, anos] = await Promise.all([
    listarMensalidades({ status: status ?? 'todos', anoLetivoId }).catch(() => []),
    resumoFinanceiro(anoLetivoId).catch(() => ({ totalPago: 0, qtdPendente: 0, qtdAtrasado: 0, valorPendente: 0, total: 0 })),
    listarAnosLetivos().catch(() => []),
  ])

  const anoAtivo = anos.find((a: any) => a.ativo)

  return (
    <AppShell
      papel={perfil.papel}
      nomeUsuario={perfil.nome}
      titulo="Financeiro"
      breadcrumb={[{ label: 'Dashboard', href: '/admin' }, { label: 'Financeiro' }]}
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Recebido</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--green-600)', fontVariantNumeric: 'tabular-nums' }}>
            {fmt(resumo.totalPago)}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Em aberto</p>
          <p className="text-2xl font-bold mt-1" style={{ color: resumo.valorPendente > 0 ? 'var(--red-600)' : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
            {fmt(resumo.valorPendente)}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Atrasadas</p>
          <p className="text-2xl font-bold mt-1" style={{ color: resumo.qtdAtrasado > 0 ? 'var(--red-600)' : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
            {resumo.qtdAtrasado}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Total lançadas</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
            {resumo.total}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabela */}
        <div className="lg:col-span-2">
          {/* Filtros */}
          <form className="flex gap-3 mb-4 flex-wrap" method="get">
            <select
              name="status"
              defaultValue={status ?? 'todos'}
              onChange={(e: any) => e.target.form.submit()}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px',
                padding: '6px 10px', fontSize: '13px', color: 'var(--text-primary)', outline: 'none',
              }}
            >
              <option value="todos">Todos</option>
              <option value="pendente">Pendentes</option>
              <option value="atrasado">Atrasadas</option>
              <option value="pago">Pagas</option>
            </select>
            <select
              name="anoLetivoId"
              defaultValue={anoLetivoId ?? anoAtivo?.id ?? ''}
              onChange={(e: any) => e.target.form.submit()}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px',
                padding: '6px 10px', fontSize: '13px', color: 'var(--text-primary)', outline: 'none',
              }}
            >
              <option value="">Todos os anos</option>
              {anos.map((a: any) => (
                <option key={a.id} value={a.id}>{a.ano}{a.ativo ? ' (ativo)' : ''}</option>
              ))}
            </select>
            <noscript><button type="submit" style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '13px' }}>Filtrar</button></noscript>
          </form>

          <Card padding="none">
            {mensalidades.length === 0 ? (
              <p className="text-sm text-center py-10" style={{ color: 'var(--text-muted)' }}>
                Nenhuma mensalidade encontrada.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: 'var(--surface-raised)', borderBottom: '1px solid var(--border-soft)' }}>
                      {['Aluno', 'Mês', 'Valor', 'Vencimento', 'Status', ''].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
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
                        <td className="px-4 py-2.5">
                          <p className="font-medium text-xs" style={{ color: 'var(--text-primary)' }}>
                            {m.alunos?.nome_completo}
                          </p>
                          {m.alunos?.matricula && (
                            <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                              {m.alunos.matricula}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {MES_LABEL[m.mes]}/{m.anos_letivos?.ano}
                        </td>
                        <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                          {fmt(m.valor)}
                        </td>
                        <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                          {new Date(m.vencimento + 'T12:00:00').toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-2.5">
                          <Badge variant={STATUS_BADGE[m.status] ?? 'default'}>
                            {STATUS_LABEL[m.status] ?? m.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5">
                          {m.status !== 'pago' && m.status !== 'isento' && (
                            <RegistrarPagamentoBtn mensalidadeId={m.id} valor={m.valor} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Painel lateral */}
        <div>
          <Card>
            <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Gerar Mensalidades
            </h2>
            <GerarMensalidadesForm anos={anos} anoAtivoId={anoAtivo?.id ?? ''} />
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
