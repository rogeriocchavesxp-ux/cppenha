import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPerfil } from '@/lib/supabase-server'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { listarEventos } from '@/actions/eventos'
import { NovoEventoForm } from '@/components/calendario/NovoEventoForm'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const TIPO_LABEL: Record<string, { label: string; color: string }> = {
  feriado:  { label: 'Feriado',   color: 'var(--red-600)' },
  prova:    { label: 'Prova',     color: 'var(--navy-700)' },
  reuniao:  { label: 'Reunião',   color: 'var(--navy-500)' },
  culto:    { label: 'Culto',     color: 'var(--green-600)' },
  geral:    { label: 'Geral',     color: 'var(--text-muted)' },
}

const STAFF_ROLES = ['admin', 'secretaria', 'coordenador', 'professor'] as const

function buildCalendario(ano: number, mes: number, eventos: any[]) {
  const primeiroDia = new Date(ano, mes - 1, 1).getDay()
  const totalDias = new Date(ano, mes, 0).getDate()
  const eventsByDay: Record<number, any[]> = {}

  for (const e of eventos) {
    const d = new Date(e.inicio)
    const dia = d.getDate()
    if (!eventsByDay[dia]) eventsByDay[dia] = []
    eventsByDay[dia].push(e)
  }

  const cells: (number | null)[] = []
  for (let i = 0; i < primeiroDia; i++) cells.push(null)
  for (let i = 1; i <= totalDias; i++) cells.push(i)
  while (cells.length % 7 !== 0) cells.push(null)

  return { cells, eventsByDay }
}

export default async function CalendarioPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; ano?: string }>
}) {
  const perfil = await getPerfil()
  if (!perfil) redirect('/login')

  const params = await searchParams
  const hoje = new Date()
  const ano = parseInt(params.ano ?? String(hoje.getFullYear()), 10)
  const mes = parseInt(params.mes ?? String(hoje.getMonth() + 1), 10)

  const eventos = await listarEventos(ano, mes).catch(() => [])
  const { cells, eventsByDay } = buildCalendario(ano, mes, eventos)
  const isStaff = STAFF_ROLES.includes(perfil.papel as any)

  const prevMes = mes === 1 ? 12 : mes - 1
  const prevAno = mes === 1 ? ano - 1 : ano
  const nextMes = mes === 12 ? 1 : mes + 1
  const nextAno = mes === 12 ? ano + 1 : ano

  return (
    <AppShell papel={perfil.papel} nomeUsuario={perfil.nome} titulo="Calendário">
      <div className={isStaff ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : ''}>

        {/* Calendário */}
        <div className={isStaff ? 'lg:col-span-2' : ''}>
          <Card>
            {/* Navegação mês */}
            <div className="flex items-center justify-between mb-5">
              <Link
                href={`/calendario?mes=${prevMes}&ano=${prevAno}`}
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                style={{ background: 'var(--surface-raised)', color: 'var(--text-secondary)' }}
              >
                ←
              </Link>
              <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                {MESES[mes - 1]} {ano}
              </h2>
              <Link
                href={`/calendario?mes=${nextMes}&ano=${nextAno}`}
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                style={{ background: 'var(--surface-raised)', color: 'var(--text-secondary)' }}
              >
                →
              </Link>
            </div>

            {/* Grade */}
            <div className="grid grid-cols-7 gap-px" style={{ background: 'var(--border-soft)' }}>
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                <div
                  key={d}
                  className="text-center text-xs font-semibold py-2"
                  style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}
                >
                  {d}
                </div>
              ))}

              {cells.map((dia, i) => {
                const isHoje = dia === hoje.getDate() && mes === hoje.getMonth() + 1 && ano === hoje.getFullYear()
                const diaEventos = dia ? (eventsByDay[dia] ?? []) : []

                return (
                  <div
                    key={i}
                    className="min-h-20 p-1.5"
                    style={{ background: 'var(--surface)' }}
                  >
                    {dia && (
                      <>
                        <span
                          className="text-xs font-semibold inline-flex items-center justify-center w-6 h-6 rounded-full mb-1"
                          style={{
                            color: isHoje ? '#fff' : 'var(--text-secondary)',
                            background: isHoje ? 'var(--navy-900)' : 'transparent',
                          }}
                        >
                          {dia}
                        </span>
                        <div className="flex flex-col gap-0.5">
                          {diaEventos.slice(0, 3).map((e: any) => {
                            const tipo = TIPO_LABEL[e.tipo] ?? TIPO_LABEL.geral
                            return (
                              <span
                                key={e.id}
                                className="text-xs truncate px-1 rounded"
                                style={{
                                  color: tipo.color,
                                  background: 'var(--surface-raised)',
                                  fontSize: '10px',
                                  lineHeight: '16px',
                                }}
                                title={e.titulo}
                              >
                                {e.titulo}
                              </span>
                            )
                          })}
                          {diaEventos.length > 3 && (
                            <span className="text-xs" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                              +{diaEventos.length - 3} mais
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Lista de eventos do mês */}
          {eventos.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              {eventos.map((e: any) => {
                const tipo = TIPO_LABEL[e.tipo] ?? TIPO_LABEL.geral
                const dataStr = new Date(e.inicio).toLocaleDateString('pt-BR', {
                  weekday: 'short', day: '2-digit', month: 'short',
                })
                return (
                  <Card key={e.id} className="flex items-start gap-3">
                    <div className="w-1 self-stretch rounded-full shrink-0 mt-1" style={{ background: tipo.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{e.titulo}</p>
                      {e.descricao && (
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{e.descricao}</p>
                      )}
                      <p className="text-xs mt-1 capitalize" style={{ color: 'var(--text-muted)' }}>
                        {dataStr} · {tipo.label}
                        {e.perfis?.nome && ` · ${e.perfis.nome}`}
                      </p>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          {eventos.length === 0 && (
            <p className="text-sm text-center mt-6" style={{ color: 'var(--text-muted)' }}>
              Nenhum evento em {MESES[mes - 1]}.
            </p>
          )}
        </div>

        {/* Formulário novo evento (staff) */}
        {isStaff && (
          <div>
            <Card>
              <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Novo Evento
              </h2>
              <NovoEventoForm ano={ano} mes={mes} />
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  )
}
