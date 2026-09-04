import { redirect } from 'next/navigation'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { listarComunicados } from '@/actions/comunicados'
import { NovoComunicadoForm } from '@/components/comunicados/NovoComunicadoForm'
import { EnviarEmailBtn } from '@/components/comunicados/EnviarEmailBtn'

const DESTINO_LABEL: Record<string, string> = {
  todos: 'Todos', turma: 'Turma', aluno: 'Aluno', colaboradores: 'Colaboradores',
}

const STAFF_ROLES = ['admin', 'secretaria', 'coordenador', 'professor'] as const

export default async function ComunicadosPage() {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const comunicados = await listarComunicados(50).catch(() => [])
  const isStaff = STAFF_ROLES.includes(perfil.papel as any)

  return (
    <AppShell papel={perfil.papel} nomeUsuario={perfil.nome} titulo="Comunicados">
      <div className={isStaff ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : ''}>
        {/* Lista */}
        <div className={isStaff ? 'lg:col-span-2' : ''}>
          {comunicados.length === 0 ? (
            <Card>
              <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>
                Nenhum comunicado publicado.
              </p>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {comunicados.map((c: any) => (
                <Card key={c.id}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h2 className="text-sm font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
                      {c.titulo}
                    </h2>
                    <div className="flex gap-2 shrink-0">
                      <Badge variant="default">{DESTINO_LABEL[c.destino] ?? c.destino}</Badge>
                      {c.turmas && <Badge variant="info">{c.turmas.nome}</Badge>}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                    {c.conteudo}
                  </p>
                  <div className="flex items-center justify-between gap-3 mt-2">
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {c.perfis?.nome} · {new Date(c.publicado_em).toLocaleDateString('pt-BR', {
                        day: '2-digit', month: 'long', year: 'numeric',
                      })}
                    </p>
                    {isStaff && <EnviarEmailBtn comunicadoId={c.id} />}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Formulário de criação (apenas staff) */}
        {isStaff && (
          <div>
            <Card>
              <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Novo Comunicado
              </h2>
              <NovoComunicadoForm />
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  )
}
