import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { listarAtribuicoesDoprofessor } from '@/actions/atribuicoes'

const TURNO_LABEL: Record<string, string> = { manha: 'Manhã', tarde: 'Tarde', integral: 'Integral' }

export default async function ProfessorPage() {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const atribuicoes = await listarAtribuicoesDoprofessor().catch(() => [])

  const turmasUnicas = Array.from(
    new Map(atribuicoes.map((a: any) => [a.turma_id, a.turmas])).values()
  ) as any[]

  const totalDisciplinas = new Set(atribuicoes.map((a: any) => a.disciplina_id)).size

  return (
    <AppShell
      papel={perfil.papel}
      nomeUsuario={perfil.nome}
      titulo="Minhas Turmas"
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Turmas
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: 'var(--navy-900)', fontVariantNumeric: 'tabular-nums' }}>
            {turmasUnicas.length}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Disciplinas
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: 'var(--navy-900)', fontVariantNumeric: 'tabular-nums' }}>
            {totalDisciplinas}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Atribuições
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: 'var(--navy-900)', fontVariantNumeric: 'tabular-nums' }}>
            {atribuicoes.length}
          </p>
        </Card>
      </div>

      {/* Lista de turmas */}
      {turmasUnicas.length === 0 ? (
        <Card>
          <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>
            Nenhuma turma atribuída. Contate a coordenação.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {turmasUnicas.map((turma: any) => {
            const discs = atribuicoes
              .filter((a: any) => a.turma_id === turma.id)
              .map((a: any) => a.disciplinas?.nome)

            return (
              <Card key={turma.id}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {turma.nome}
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {turma.serie}
                    </p>
                  </div>
                  <Badge variant="info">{TURNO_LABEL[turma.turno] ?? turma.turno}</Badge>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {discs.map((d: string) => (
                    <span
                      key={d}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--navy-50)', color: 'var(--navy-700)' }}
                    >
                      {d}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/professor/notas?turma=${turma.id}`}
                    className="text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
                    style={{ background: 'var(--navy-900)', color: '#fff' }}
                  >
                    Lançar Notas
                  </Link>
                  <Link
                    href={`/professor/chamada?turma=${turma.id}`}
                    className="text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
                    style={{ background: 'var(--surface-raised)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                  >
                    Fazer Chamada
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </AppShell>
  )
}
