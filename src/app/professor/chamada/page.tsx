import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { listarAtribuicoesDoprofessor } from '@/actions/atribuicoes'

const TURNO_LABEL: Record<string, string> = { manha: 'Manhã', tarde: 'Tarde', integral: 'Integral' }

export default async function ChamadaPage() {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const atribuicoes = await listarAtribuicoesDoprofessor().catch(() => [])
  const hoje = new Date().toISOString().split('T')[0]

  return (
    <AppShell
      papel={perfil.papel}
      nomeUsuario={perfil.nome}
      titulo="Chamada"
      breadcrumb={[{ label: 'Minhas Turmas', href: '/professor' }, { label: 'Chamada' }]}
    >
      {atribuicoes.length === 0 ? (
        <Card>
          <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>
            Nenhuma atribuição encontrada.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {atribuicoes.map((a: any) => (
            <Card key={a.id}>
              <h3 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                {a.turmas?.nome}
              </h3>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                {a.disciplinas?.nome}
              </p>
              <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                {TURNO_LABEL[a.turmas?.turno] ?? a.turmas?.turno}
              </p>
              <Link
                href={`/professor/chamada/${a.turma_id}/${a.disciplina_id}?data=${hoje}`}
                className="block text-xs font-medium px-3 py-2 rounded-md text-center transition-colors"
                style={{ background: 'var(--navy-900)', color: '#fff' }}
              >
                Chamada de Hoje
              </Link>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  )
}
