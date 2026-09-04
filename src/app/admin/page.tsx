import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { createSupabaseServer } from '@/lib/supabase-server'
import { resumoFinanceiro } from '@/actions/mensalidades'

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default async function AdminPage() {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const sb = await createSupabaseServer()

  const [
    { count: totalAlunos },
    { count: totalTurmas },
    { count: totalColaboradores },
    financeiro,
  ] = await Promise.all([
    sb.from('alunos').select('id', { count: 'exact', head: true }).eq('ativo', true),
    sb.from('turmas').select('id', { count: 'exact', head: true }),
    sb.from('perfis').select('id', { count: 'exact', head: true }).neq('role', 'pai'),
    resumoFinanceiro().catch(() => ({ totalPago: 0, qtdPendente: 0, qtdAtrasado: 0, valorPendente: 0, total: 0 })),
  ])

  const kpis = [
    { label: 'Alunos ativos',         valor: String(totalAlunos ?? 0),          href: '/secretaria/alunos' },
    { label: 'Turmas',                 valor: String(totalTurmas ?? 0),           href: '/secretaria/turmas' },
    { label: 'Colaboradores',          valor: String(totalColaboradores ?? 0),    href: '/admin/colaboradores' },
    { label: 'Mensalidades em aberto', valor: String(financeiro.qtdPendente),     href: '/admin/financeiro', destaque: financeiro.qtdAtrasado > 0 },
  ]

  return (
    <AppShell papel={perfil.papel} nomeUsuario={perfil.nome} titulo="Dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(kpi => (
          <Link key={kpi.label} href={kpi.href}>
            <Card className="hover:shadow-sm transition-shadow cursor-pointer">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                {kpi.label}
              </p>
              <p
                className="text-3xl font-bold mt-1"
                style={{ color: kpi.destaque ? 'var(--red-600)' : 'var(--navy-900)', fontVariantNumeric: 'tabular-nums' }}
              >
                {kpi.valor}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Resumo financeiro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Financeiro — Visão Geral
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Recebido</p>
              <p className="text-xl font-bold mt-0.5" style={{ color: 'var(--green-600)', fontVariantNumeric: 'tabular-nums' }}>
                {fmt(financeiro.totalPago)}
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Inadimplência</p>
              <p
                className="text-xl font-bold mt-0.5"
                style={{ color: financeiro.valorPendente > 0 ? 'var(--red-600)' : 'var(--green-600)', fontVariantNumeric: 'tabular-nums' }}
              >
                {fmt(financeiro.valorPendente)}
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Atrasadas</p>
              <p className="text-xl font-bold mt-0.5" style={{ color: financeiro.qtdAtrasado > 0 ? 'var(--red-600)' : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                {financeiro.qtdAtrasado}
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total lançadas</p>
              <p className="text-xl font-bold mt-0.5" style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                {financeiro.total}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/admin/financeiro"
              className="text-xs font-medium"
              style={{ color: 'var(--navy-500)' }}
            >
              Ver módulo financeiro →
            </Link>
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Acesso Rápido
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Nova Matrícula',  href: '/secretaria/matriculas/nova' },
              { label: 'Novo Aluno',      href: '/secretaria/alunos/novo' },
              { label: 'Gerar Mensalidades', href: '/admin/financeiro?acao=gerar' },
              { label: 'Comunicados',     href: '/comunicados' },
            ].map(a => (
              <Link
                key={a.label}
                href={a.href}
                className="text-xs font-medium px-3 py-2.5 rounded-md text-center"
                style={{ background: 'var(--surface-raised)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              >
                {a.label}
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
