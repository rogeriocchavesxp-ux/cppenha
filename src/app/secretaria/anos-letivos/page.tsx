import { redirect } from 'next/navigation'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { listarAnosLetivos, ativarAnoLetivo, criarAnoLetivo } from '@/actions/turmas'
import { AnoLetivoForm } from '@/components/secretaria/AnoLetivoForm'

export default async function AnosLetivosPage() {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const anos = await listarAnosLetivos()

  return (
    <AppShell
      papel={perfil.papel}
      nomeUsuario={perfil.nome}
      titulo="Anos Letivos"
      breadcrumb={[{ label: 'Secretaria', href: '/secretaria' }, { label: 'Anos Letivos' }]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Anos cadastrados
              </h2>
            </div>
            {anos.length === 0 ? (
              <p className="px-5 py-10 text-sm text-center" style={{ color: 'var(--text-muted)' }}>
                Nenhum ano letivo cadastrado.
              </p>
            ) : (
              <div className="divide-y" style={{ borderColor: 'var(--border-soft)' }}>
                {anos.map((ano: any) => (
                  <div key={ano.id} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {ano.ano}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {new Date(ano.inicio).toLocaleDateString('pt-BR')} —{' '}
                        {new Date(ano.termino).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {ano.ativo ? (
                        <Badge variant="success">Ativo</Badge>
                      ) : (
                        <form action={ativarAnoLetivo.bind(null, ano.id)}>
                          <button
                            type="submit"
                            className="text-xs font-medium cursor-pointer"
                            style={{ color: 'var(--navy-700)' }}
                          >
                            Ativar
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Formulário novo */}
        <div>
          <Card>
            <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Novo Ano Letivo
            </h2>
            <AnoLetivoForm />
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
