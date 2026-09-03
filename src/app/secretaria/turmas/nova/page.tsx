import { redirect } from 'next/navigation'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { TurmaForm } from '@/components/secretaria/TurmaForm'
import { listarAnosLetivos } from '@/actions/turmas'

export default async function NovaTurmaPage() {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const anos = await listarAnosLetivos()

  return (
    <AppShell
      papel={perfil.papel}
      nomeUsuario={perfil.nome}
      titulo="Nova Turma"
      breadcrumb={[
        { label: 'Secretaria', href: '/secretaria' },
        { label: 'Turmas', href: '/secretaria/turmas' },
        { label: 'Nova' },
      ]}
    >
      <div className="max-w-lg">
        <Card>
          <TurmaForm anos={anos} />
        </Card>
      </div>
    </AppShell>
  )
}
