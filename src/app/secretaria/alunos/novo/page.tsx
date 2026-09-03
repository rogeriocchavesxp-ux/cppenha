import { redirect } from 'next/navigation'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { AlunoForm } from '@/components/secretaria/AlunoForm'

export default async function NovoAlunoPage() {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  return (
    <AppShell
      papel={perfil.papel}
      nomeUsuario={perfil.nome}
      titulo="Novo Aluno"
      breadcrumb={[
        { label: 'Secretaria', href: '/secretaria' },
        { label: 'Alunos', href: '/secretaria/alunos' },
        { label: 'Novo' },
      ]}
    >
      <div className="max-w-lg">
        <Card>
          <AlunoForm />
        </Card>
      </div>
    </AppShell>
  )
}
