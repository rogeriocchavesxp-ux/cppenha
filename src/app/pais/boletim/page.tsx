import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { listarMeusFilhos, boletimDoAluno } from '@/actions/responsaveis'

type Props = { searchParams: Promise<{ aluno?: string }> }

function mediaFinal(notas: any[]): number | null {
  if (notas.length === 0) return null
  const vals = notas.map(n => n.recuperacao ?? n.nota).filter(v => v !== null)
  if (vals.length === 0) return null
  return vals.reduce((a: number, b: number) => a + b, 0) / vals.length
}

function notaColor(v: number | null): string {
  if (v === null) return 'var(--text-muted)'
  if (v >= 7) return 'var(--green-600)'
  if (v >= 5) return 'var(--amber-600)'
  return 'var(--red-600)'
}

export default async function BoletimPage({ searchParams }: Props) {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const { aluno: alunoId } = await searchParams
  const filhos = await listarMeusFilhos().catch(() => [])

  if (filhos.length === 0) redirect('/pais')

  const alunoSelecionado = alunoId
    ? (filhos.find((r: any) => r.alunos?.id === alunoId) as any)
    : (filhos[0] as any)

  if (!alunoSelecionado) redirect('/pais')

  const { matricula, notas } = await boletimDoAluno(alunoSelecionado.alunos.id).catch(() => ({
    matricula: null, notas: [],
  }))

  // agrupar notas por disciplina
  const porDisciplina: Record<string, any[]> = {}
  for (const n of notas) {
    const nome = (n as any).disciplinas?.nome ?? 'Sem disciplina'
    if (!porDisciplina[nome]) porDisciplina[nome] = []
    porDisciplina[nome].push(n)
  }

  const BIMESTRES = [1, 2, 3, 4]

  return (
    <AppShell
      papel={perfil.papel}
      nomeUsuario={perfil.nome}
      titulo="Boletim"
      breadcrumb={[{ label: 'Início', href: '/pais' }, { label: 'Boletim' }]}
    >
      {/* Seletor de filho */}
      {filhos.length > 1 && (
        <div className="flex gap-2 mb-5 flex-wrap">
          {filhos.map((r: any) => (
            <Link
              key={r.id}
              href={`/pais/boletim?aluno=${r.alunos?.id}`}
              className="text-xs font-medium px-4 py-2 rounded-full transition-colors"
              style={{
                background: r.alunos?.id === alunoSelecionado.alunos?.id ? 'var(--navy-900)' : 'var(--surface-raised)',
                color:      r.alunos?.id === alunoSelecionado.alunos?.id ? '#fff' : 'var(--text-primary)',
                border:     '1px solid var(--border)',
              }}
            >
              {r.alunos?.nome_completo}
            </Link>
          ))}
        </div>
      )}

      {/* Info turma */}
      {matricula ? (
        <div className="mb-5">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {(matricula as any).turmas?.nome} — {(matricula as any).anos_letivos?.ano}
          </p>
        </div>
      ) : (
        <Card>
          <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>
            Sem matrícula ativa. Contate a secretaria.
          </p>
        </Card>
      )}

      {/* Grid de notas */}
      {Object.keys(porDisciplina).length > 0 && (
        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--surface-raised)', borderBottom: '1px solid var(--border-soft)' }}>
                <th className="text-left px-5 py-3 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                  Disciplina
                </th>
                {BIMESTRES.map(b => (
                  <th key={b} className="px-4 py-3 text-xs font-semibold text-center" style={{ color: 'var(--text-muted)' }}>
                    {b}º Bim
                  </th>
                ))}
                <th className="px-4 py-3 text-xs font-semibold text-center" style={{ color: 'var(--text-muted)' }}>
                  Média
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(porDisciplina).map(([disc, ns], i, arr) => {
                const isLast = i === arr.length - 1
                const media = mediaFinal(ns)
                return (
                  <tr key={disc} style={{ borderBottom: isLast ? 'none' : '1px solid var(--border-soft)' }}>
                    <td className="px-5 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                      {disc}
                    </td>
                    {BIMESTRES.map(b => {
                      const n = ns.find((x: any) => x.bimestre === b)
                      const valor = n?.recuperacao ?? n?.nota ?? null
                      return (
                        <td key={b} className="px-4 py-3 text-center font-semibold" style={{
                          color: notaColor(valor),
                          fontVariantNumeric: 'tabular-nums',
                        }}>
                          {valor !== null ? valor.toFixed(1) : '—'}
                          {n?.recuperacao !== null && n?.recuperacao !== undefined && (
                            <span className="text-xs ml-1" style={{ color: 'var(--amber-600)' }}>R</span>
                          )}
                        </td>
                      )
                    })}
                    <td className="px-4 py-3 text-center font-bold" style={{
                      color: notaColor(media),
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {media !== null ? media.toFixed(1) : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {notas.length === 0 && matricula && (
        <Card>
          <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>
            Nenhuma nota lançada ainda.
          </p>
        </Card>
      )}

      <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
        R = nota de recuperação
      </p>
    </AppShell>
  )
}
