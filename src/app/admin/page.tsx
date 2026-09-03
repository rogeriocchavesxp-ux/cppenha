import { redirect } from 'next/navigation'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'

export default async function AdminPage() {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  return (
    <AppShell papel={perfil.papel} nomeUsuario={perfil.nome} titulo="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Alunos matriculados', valor: '—' },
          { label: 'Turmas ativas', valor: '—' },
          { label: 'Mensalidades pendentes', valor: '—' },
          { label: 'Colaboradores', valor: '—' },
        ].map(kpi => (
          <Card key={kpi.label}>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
              {kpi.label}
            </p>
            <p className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              {kpi.valor}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo, {perfil.nome}</CardTitle>
        </CardHeader>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          O sistema está em configuração. Os módulos serão adicionados nas próximas fases.
        </p>
      </Card>
    </AppShell>
  )
}
