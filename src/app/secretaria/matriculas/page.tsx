import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { listarMatriculas } from '@/actions/matriculas'

const STATUS_BADGE: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  ativa: 'success', trancada: 'warning', cancelada: 'danger',
  concluida: 'default', transferida: 'default',
}
const STATUS_LABEL: Record<string, string> = {
  ativa: 'Ativa', trancada: 'Trancada', cancelada: 'Cancelada',
  concluida: 'Concluída', transferida: 'Transferida',
}
const TURNO_LABEL: Record<string, string> = { manha: 'Manhã', tarde: 'Tarde', integral: 'Integral' }

export default async function MatriculasPage() {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const matriculas = await listarMatriculas()

  return (
    <AppShell
      papel={perfil.papel}
      nomeUsuario={perfil.nome}
      titulo="Matrículas"
      breadcrumb={[{ label: 'Secretaria', href: '/secretaria' }, { label: 'Matrículas' }]}
    >
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {matriculas.length} matrícula{matriculas.length !== 1 ? 's' : ''}
        </p>
        <Link href="/secretaria/matriculas/nova">
          <Button size="sm">+ Nova Matrícula</Button>
        </Link>
      </div>

      <Card padding="none">
        {matriculas.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Nenhuma matrícula registrada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  {['Aluno', 'Turma', 'Turno', 'Ano', 'Data', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matriculas.map((m: any) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                    <td className="px-5 py-3">
                      <Link
                        href={`/secretaria/alunos/${m.alunos?.id}`}
                        className="font-medium hover:underline"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {m.alunos?.nome_completo}
                      </Link>
                      {m.alunos?.matricula && (
                        <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {m.alunos.matricula}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3" style={{ color: 'var(--text-secondary)' }}>{m.turmas?.nome}</td>
                    <td className="px-5 py-3" style={{ color: 'var(--text-secondary)' }}>
                      {TURNO_LABEL[m.turmas?.turno] ?? '—'}
                    </td>
                    <td className="px-5 py-3 font-variant-numeric" style={{ color: 'var(--text-secondary)' }}>
                      {m.anos_letivos?.ano}
                    </td>
                    <td className="px-5 py-3" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(m.data_matricula).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={STATUS_BADGE[m.status] ?? 'default'}>
                        {STATUS_LABEL[m.status] ?? m.status}
                      </Badge>
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
