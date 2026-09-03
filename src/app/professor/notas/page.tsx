import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { listarAtribuicoesDoprofessor } from '@/actions/atribuicoes'

type Props = { searchParams: Promise<{ turma?: string }> }

export default async function NotasPage({ searchParams }: Props) {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const { turma: turmaIdInicial } = await searchParams
  const atribuicoes = await listarAtribuicoesDoprofessor().catch(() => [])

  const turmasUnicas = Array.from(
    new Map(atribuicoes.map((a: any) => [a.turma_id, a.turmas])).values()
  ) as any[]

  const BIMESTRES = [1, 2, 3, 4]

  return (
    <AppShell
      papel={perfil.papel}
      nomeUsuario={perfil.nome}
      titulo="Lançamento de Notas"
      breadcrumb={[{ label: 'Minhas Turmas', href: '/professor' }, { label: 'Notas' }]}
    >
      {atribuicoes.length === 0 ? (
        <Card>
          <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>
            Nenhuma atribuição encontrada. Contate a coordenação.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {atribuicoes.map((a: any) => (
            <Card key={a.id}>
              <h3 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                {a.turmas?.nome}
              </h3>
              <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                {a.disciplinas?.nome}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {BIMESTRES.map(b => (
                  <Link
                    key={b}
                    href={`/professor/notas/${a.turma_id}/${a.disciplina_id}/${b}`}
                    className="text-xs font-medium px-3 py-2 rounded-md text-center transition-colors"
                    style={{
                      background: 'var(--surface-raised)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {b}º Bimestre
                  </Link>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  )
}
