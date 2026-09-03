import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { listarAlunos } from '@/actions/alunos'
import { BuscaAlunos } from '@/components/secretaria/BuscaAlunos'

type Props = { searchParams: Promise<{ q?: string }> }

export default async function AlunosPage({ searchParams }: Props) {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const { q } = await searchParams
  const alunos = await listarAlunos(q)

  return (
    <AppShell
      papel={perfil.papel}
      nomeUsuario={perfil.nome}
      titulo="Alunos"
      breadcrumb={[{ label: 'Secretaria', href: '/secretaria' }, { label: 'Alunos' }]}
    >
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <BuscaAlunos valorInicial={q} />
        <Link href="/secretaria/alunos/novo">
          <Button size="sm">+ Novo Aluno</Button>
        </Link>
      </div>

      <Card padding="none">
        {alunos.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {q ? `Nenhum aluno encontrado para "${q}".` : 'Nenhum aluno cadastrado.'}
            </p>
            {!q && (
              <Link href="/secretaria/alunos/novo">
                <Button size="sm" variant="secondary" className="mt-4">Cadastrar primeiro aluno</Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            <div
              className="px-5 py-3 text-xs font-semibold"
              style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-soft)' }}
            >
              {alunos.length} aluno{alunos.length !== 1 ? 's' : ''}
              {q ? ` para "${q}"` : ''}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-soft)' }}>
                    {['Nome', 'Matrícula', 'Nascimento', 'CPF', 'Situação', ''].map(h => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-semibold"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {alunos.map((a: any) => (
                    <tr key={a.id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                      <td className="px-5 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                        {a.nome_completo}
                      </td>
                      <td
                        className="px-5 py-3 font-mono text-xs"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {a.matricula ?? '—'}
                      </td>
                      <td className="px-5 py-3" style={{ color: 'var(--text-secondary)' }}>
                        {new Date(a.data_nascimento + 'T12:00:00').toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-5 py-3" style={{ color: 'var(--text-secondary)' }}>
                        {a.cpf ?? '—'}
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={a.ativo ? 'success' : 'default'}>
                          {a.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <Link
                          href={`/secretaria/alunos/${a.id}`}
                          className="text-xs font-medium"
                          style={{ color: 'var(--navy-700)' }}
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </AppShell>
  )
}
