import { redirect } from 'next/navigation'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'

export default async function PaisPage() {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  return (
    <AppShell papel={perfil.papel} nomeUsuario={perfil.nome} titulo="Início">
      <Card>
        <CardHeader><CardTitle>Bem-vindo, {perfil.nome}</CardTitle></CardHeader>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Portal dos pais em desenvolvimento — Fase 3.
        </p>
      </Card>
    </AppShell>
  )
}
