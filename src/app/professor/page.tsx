import { redirect } from 'next/navigation'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'

export default async function ProfessorPage() {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  return (
    <AppShell papel={perfil.papel} nomeUsuario={perfil.nome} titulo="Minhas Turmas">
      <Card>
        <CardHeader><CardTitle>Bem-vindo, {perfil.nome}</CardTitle></CardHeader>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Portal do professor em desenvolvimento — Fase 2.
        </p>
      </Card>
    </AppShell>
  )
}
