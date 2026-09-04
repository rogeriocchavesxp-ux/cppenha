import { redirect } from 'next/navigation'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { listarDisciplinas } from '@/actions/disciplinas'
import { DisciplinasCRUD } from '@/components/coordenacao/DisciplinasCRUD'

export default async function DisciplinasPage() {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const disciplinas = await listarDisciplinas().catch(() => [])

  return (
    <AppShell
      papel={perfil.papel}
      nomeUsuario={perfil.nome}
      titulo="Disciplinas"
      breadcrumb={[{ label: 'Coordenação', href: '/coordenacao' }, { label: 'Disciplinas' }]}
    >
      <DisciplinasCRUD disciplinas={disciplinas as any} />
    </AppShell>
  )
}
