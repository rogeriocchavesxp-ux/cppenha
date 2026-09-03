import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPerfil, createSupabaseServer } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

async function getKPIs() {
  const supabase = await createSupabaseServer()

  const [alunos, matriculas, turmas, anoAtivo] = await Promise.all([
    supabase.from('alunos').select('id', { count: 'exact' }).eq('ativo', true),
    supabase.from('matriculas').select('id', { count: 'exact' }).eq('status', 'ativa'),
    supabase.from('turmas').select('id', { count: 'exact' }),
    supabase.from('anos_letivos').select('ano').eq('ativo', true).single(),
  ])

  return {
    totalAlunos:    alunos.count ?? 0,
    totalMatriculas: matriculas.count ?? 0,
    totalTurmas:    turmas.count ?? 0,
    anoAtivo:       anoAtivo.data?.ano ?? null,
  }
}

async function getMatriculasRecentes() {
  const supabase = await createSupabaseServer()
  const { data } = await supabase
    .from('matriculas')
    .select('id, status, data_matricula, alunos(nome_completo), turmas(nome)')
    .order('criado_em', { ascending: false })
    .limit(5)
  return data ?? []
}

const STATUS_BADGE: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  ativa:      'success',
  trancada:   'warning',
  cancelada:  'danger',
  concluida:  'default',
  transferida:'default',
}

const STATUS_LABEL: Record<string, string> = {
  ativa:      'Ativa',
  trancada:   'Trancada',
  cancelada:  'Cancelada',
  concluida:  'Concluída',
  transferida:'Transferida',
}

export default async function SecretariaPage() {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const [kpis, recentes] = await Promise.all([getKPIs(), getMatriculasRecentes()])

  const atalhos = [
    { label: 'Novo Aluno',    href: '/secretaria/alunos/novo',    desc: 'Cadastrar aluno' },
    { label: 'Nova Turma',    href: '/secretaria/turmas/nova',    desc: 'Criar turma' },
    { label: 'Nova Matrícula',href: '/secretaria/matriculas/nova', desc: 'Matricular aluno' },
    { label: 'Anos Letivos',  href: '/secretaria/anos-letivos',   desc: 'Gerenciar anos' },
  ]

  return (
    <AppShell papel={perfil.papel} nomeUsuario={perfil.nome} titulo="Secretaria Acadêmica">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Alunos Ativos',     valor: kpis.totalAlunos,     href: '/secretaria/alunos' },
          { label: 'Matrículas Ativas', valor: kpis.totalMatriculas, href: '/secretaria/matriculas' },
          { label: 'Turmas',            valor: kpis.totalTurmas,     href: '/secretaria/turmas' },
          { label: 'Ano Letivo Ativo',  valor: kpis.anoAtivo ?? '—', href: '/secretaria/anos-letivos' },
        ].map(kpi => (
          <Link key={kpi.label} href={kpi.href}>
            <Card className="hover:border-[var(--navy-200)] transition-colors cursor-pointer">
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
                {kpi.label}
              </p>
              <p
                className="text-3xl font-semibold font-display leading-none"
                style={{ color: 'var(--navy-900)' }}
              >
                {kpi.valor}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Matrículas recentes */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid var(--border-soft)' }}
            >
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Matrículas Recentes
              </h2>
              <Link
                href="/secretaria/matriculas"
                className="text-xs font-medium"
                style={{ color: 'var(--navy-700)' }}
              >
                Ver todas
              </Link>
            </div>

            {recentes.length === 0 ? (
              <p className="px-5 py-8 text-sm text-center" style={{ color: 'var(--text-muted)' }}>
                Nenhuma matrícula registrada ainda.
              </p>
            ) : (
              <div className="divide-y" style={{ borderColor: 'var(--border-soft)' }}>
                {recentes.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {m.alunos?.nome_completo}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {m.turmas?.nome} · {new Date(m.data_matricula).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge variant={STATUS_BADGE[m.status] ?? 'default'}>
                      {STATUS_LABEL[m.status] ?? m.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Atalhos */}
        <div>
          <Card padding="none">
            <div
              className="px-5 py-4"
              style={{ borderBottom: '1px solid var(--border-soft)' }}
            >
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Ações Rápidas
              </h2>
            </div>
            <div className="p-3 flex flex-col gap-1">
              {atalhos.map(a => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-md transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--navy-50)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <p className="text-sm font-medium">{a.label}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{a.desc}</p>
                  </div>
                  <span style={{ color: 'var(--text-muted)' }}>→</span>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
