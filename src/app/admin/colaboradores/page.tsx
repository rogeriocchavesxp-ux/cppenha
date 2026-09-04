import { redirect } from 'next/navigation'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { listarColaboradores } from '@/actions/colaboradores'
import { ColaboradoresTable } from '@/components/admin/ColaboradoresTable'

export default async function ColaboradoresPage() {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const colaboradores = await listarColaboradores().catch(() => [])

  return (
    <AppShell
      papel={perfil.papel}
      nomeUsuario={perfil.nome}
      titulo="Colaboradores"
      breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Colaboradores' }]}
    >
      <ColaboradoresTable colaboradores={colaboradores as any} currentUserId={perfil.id} />
    </AppShell>
  )
}
