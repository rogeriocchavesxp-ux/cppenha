import { redirect } from 'next/navigation'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { listarAnosLetivos, ativarAnoLetivo } from '@/actions/turmas'
import { AtivarAnoBtn } from '@/components/admin/AtivarAnoBtn'

export default async function ConfiguracoesPage() {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const anos = await listarAnosLetivos().catch(() => [])
  const anoAtivo = anos.find((a: any) => a.ativo)

  return (
    <AppShell
      papel={perfil.papel}
      nomeUsuario={perfil.nome}
      titulo="Configurações"
      breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Configurações' }]}
    >
      <div className="flex flex-col gap-6 max-w-2xl">

        {/* Informações do sistema */}
        <Card>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Sistema
          </h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <dt style={{ color: 'var(--text-muted)' }}>Nome</dt>
            <dd style={{ color: 'var(--text-primary)' }}>Colégio Presbiteriano da Penha</dd>

            <dt style={{ color: 'var(--text-muted)' }}>Sigla</dt>
            <dd style={{ color: 'var(--text-primary)' }}>CPP</dd>

            <dt style={{ color: 'var(--text-muted)' }}>Ano letivo ativo</dt>
            <dd style={{ color: 'var(--text-primary)' }}>
              {anoAtivo ? (
                <Badge variant="success">{anoAtivo.ano}</Badge>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>Nenhum</span>
              )}
            </dd>

            <dt style={{ color: 'var(--text-muted)' }}>Administrador</dt>
            <dd style={{ color: 'var(--text-primary)' }}>{perfil.nome}</dd>
          </dl>
        </Card>

        {/* Anos letivos */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Anos Letivos
            </h2>
            <a
              href="/secretaria/anos-letivos"
              className="text-xs font-medium"
              style={{ color: 'var(--navy-700)' }}
            >
              Gerenciar →
            </a>
          </div>

          {anos.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Nenhum ano letivo cadastrado.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {anos.map((a: any) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between px-4 py-3 rounded-lg"
                  style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-soft)' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {a.ano}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {new Date(a.inicio).toLocaleDateString('pt-BR')} — {new Date(a.termino).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {a.ativo ? (
                      <Badge variant="success">Ativo</Badge>
                    ) : (
                      <AtivarAnoBtn anoId={a.id} ano={a.ano} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Acesso ao painel Supabase */}
        <Card>
          <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Gerenciamento de Usuários
          </h2>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            Para cadastrar novos colaboradores, acesse o painel do Supabase → Authentication → Users.
            Após criar o usuário, cadastre o perfil na tabela <code className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-raised)' }}>perfis</code>.
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Para recuperar senhas, use Authentication → Users → Send recovery email.
          </p>
        </Card>

      </div>
    </AppShell>
  )
}
