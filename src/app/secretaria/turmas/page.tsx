import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { listarTurmas } from '@/actions/turmas'

const TURNO_LABEL: Record<string, string> = {
  manha: 'Manhã', tarde: 'Tarde', integral: 'Integral',
}
const NIVEL_LABEL: Record<string, string> = {
  infantil: 'Ed. Infantil', fundamental_1: 'Fund. I',
  fundamental_2: 'Fund. II', medio: 'Ensino Médio',
}

export default async function TurmasPage() {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const turmas = await listarTurmas()

  return (
    <AppShell
      papel={perfil.papel}
      nomeUsuario={perfil.nome}
      titulo="Turmas"
      breadcrumb={[{ label: 'Secretaria', href: '/secretaria' }, { label: 'Turmas' }]}
    >
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {turmas.length} turma{turmas.length !== 1 ? 's' : ''} cadastrada{turmas.length !== 1 ? 's' : ''}
        </p>
        <Link href="/secretaria/turmas/nova">
          <Button size="sm">+ Nova Turma</Button>
        </Link>
      </div>

      <Card padding="none">
        {turmas.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Nenhuma turma cadastrada.</p>
            <Link href="/secretaria/turmas/nova">
              <Button size="sm" variant="secondary" className="mt-4">Criar primeira turma</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  {['Turma', 'Série', 'Nível', 'Turno', 'Ano', 'Capacidade', ''].map(h => (
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
                {turmas.map((t: any) => (
                  <tr
                    key={t.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid var(--border-soft)' }}
                  >
                    <td className="px-5 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                      {t.nome}
                    </td>
                    <td className="px-5 py-3" style={{ color: 'var(--text-secondary)' }}>{t.serie}</td>
                    <td className="px-5 py-3">
                      <Badge variant="info">{NIVEL_LABEL[t.nivel] ?? t.nivel}</Badge>
                    </td>
                    <td className="px-5 py-3" style={{ color: 'var(--text-secondary)' }}>
                      {TURNO_LABEL[t.turno] ?? t.turno}
                    </td>
                    <td className="px-5 py-3 font-variant-numeric" style={{ color: 'var(--text-secondary)' }}>
                      {t.anos_letivos?.ano ?? '—'}
                    </td>
                    <td className="px-5 py-3" style={{ color: 'var(--text-secondary)' }}>
                      {t.capacidade} alunos
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/secretaria/turmas/${t.id}`}
                        className="text-xs font-medium"
                        style={{ color: 'var(--navy-700)' }}
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AppShell>
  )
}
