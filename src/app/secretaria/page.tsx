import { redirect } from 'next/navigation'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'

export default async function SecretariaPage() {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  return (
    <AppShell papel={perfil.papel} nomeUsuario={perfil.nome} titulo="Secretaria Acadêmica">
      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo, {perfil.nome}</CardTitle>
        </CardHeader>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Módulo de secretaria em desenvolvimento — Fase 1.
        </p>
      </Card>
    </AppShell>
  )
}
