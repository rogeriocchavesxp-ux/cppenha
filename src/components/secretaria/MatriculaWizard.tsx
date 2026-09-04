'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { listarAlunos, criarAluno } from '@/actions/alunos'
import { criarMatricula } from '@/actions/matriculas'
import { criarResponsavel } from '@/actions/responsaveis'

type Aluno  = { id: string; nome_completo: string; matricula?: string | null }
type Turma  = { id: string; nome: string; serie: string; turno: string }
type Ano    = { id: string; ano: number; ativo: boolean }

interface Props {
  turmas: Turma[]
  anos:   Ano[]
  alunoIdInicial?: string
}

const PARENTESCOS = ['Pai', 'Mãe', 'Avô', 'Avó', 'Tio', 'Tia', 'Padrasto', 'Madrasta', 'Outro']
const TURNO_LABEL: Record<string, string> = { manha: 'Manhã', tarde: 'Tarde', integral: 'Integral' }

const inputSelectStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  borderRadius: '6px',
  padding: '8px 12px',
  fontSize: '14px',
  width: '100%',
  outline: 'none',
}

export function MatriculaWizard({ turmas, anos, alunoIdInicial }: Props) {
  const router = useRouter()

  // ── Step control ──────────────────────────────────────────────────────────
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // ── Step 1: Aluno ─────────────────────────────────────────────────────────
  const [busca, setBusca] = useState('')
  const [resultados, setResultados] = useState<Aluno[]>([])
  const [buscando, setBuscando] = useState(false)
  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null)
  const [modoNovo, setModoNovo] = useState(false)
  const [novoAluno, setNovoAluno] = useState({
    nome_completo: '', data_nascimento: '', cpf: '', matricula: '',
  })
  const [erroBusca, setErroBusca] = useState<string | null>(null)
  const [isCreating, startCreating] = useTransition()

  async function buscarAlunos() {
    if (!busca.trim()) return
    setBuscando(true)
    setErroBusca(null)
    try {
      const lista = await listarAlunos(busca)
      setResultados(lista)
    } catch {
      setErroBusca('Erro ao buscar alunos.')
    } finally {
      setBuscando(false)
    }
  }

  function selecionarAluno(a: Aluno) {
    setAlunoSelecionado(a)
    setResultados([])
    setBusca(a.nome_completo)
  }

  function criarNovoAlunoProceder() {
    if (!novoAluno.nome_completo.trim() || !novoAluno.data_nascimento) {
      setErroBusca('Nome e data de nascimento são obrigatórios.')
      return
    }
    setErroBusca(null)
    startCreating(async () => {
      try {
        const criado = await criarAluno({
          nome_completo:   novoAluno.nome_completo,
          data_nascimento: novoAluno.data_nascimento,
          cpf:      novoAluno.cpf       || undefined,
          matricula: novoAluno.matricula || undefined,
        })
        setAlunoSelecionado(criado)
        setModoNovo(false)
        setStep(2)
      } catch (e: any) {
        setErroBusca(e.message)
      }
    })
  }

  // ── Step 2: Responsável ───────────────────────────────────────────────────
  const [responsavel, setResponsavel] = useState({
    nome: '', parentesco: 'Pai', telefone: '', email: '', financeiro: true,
  })
  const [pularResp, setPularResp] = useState(false)
  const [erroResp, setErroResp] = useState<string | null>(null)

  function validarEAvancarResp() {
    if (!pularResp && !responsavel.nome.trim()) {
      setErroResp('Informe o nome do responsável ou pule esta etapa.')
      return
    }
    setErroResp(null)
    setStep(3)
  }

  // ── Step 3: Turma + Confirmação ───────────────────────────────────────────
  const anoAtivo = anos.find(a => a.ativo) ?? anos[0]
  const [turmaId, setTurmaId] = useState(turmas[0]?.id ?? '')
  const [anoId,   setAnoId  ] = useState(anoAtivo?.id ?? '')
  const [erroCriacao, setErroCriacao] = useState<string | null>(null)
  const [isSaving, startSaving] = useTransition()

  async function finalizar() {
    if (!alunoSelecionado) return
    setErroCriacao(null)
    startSaving(async () => {
      try {
        const matricula = await criarMatricula({
          aluno_id:      alunoSelecionado.id,
          turma_id:      turmaId,
          ano_letivo_id: anoId,
        })

        if (!pularResp && responsavel.nome.trim()) {
          await criarResponsavel({
            aluno_id:   alunoSelecionado.id,
            nome:       responsavel.nome,
            parentesco: responsavel.parentesco,
            telefone:   responsavel.telefone || undefined,
            email:      responsavel.email    || undefined,
            financeiro: responsavel.financeiro,
          })
        }

        router.push(`/secretaria/alunos/${alunoSelecionado.id}`)
        router.refresh()
      } catch (e: any) {
        setErroCriacao(e.message)
      }
    })
  }

  const turmaSelecionada = turmas.find(t => t.id === turmaId)
  const anoSelecionado   = anos.find(a => a.id === anoId)

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-0">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {([1, 2, 3] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold"
              style={{
                background: step >= s ? 'var(--navy-700)' : 'var(--surface-raised)',
                color:      step >= s ? '#fff' : 'var(--text-muted)',
              }}
            >
              {s}
            </div>
            <span
              className="text-xs font-medium hidden sm:block"
              style={{ color: step === s ? 'var(--text-primary)' : 'var(--text-muted)' }}
            >
              {s === 1 ? 'Aluno' : s === 2 ? 'Responsável' : 'Turma'}
            </span>
            {i < 2 && (
              <div className="w-8 h-px mx-1" style={{ background: 'var(--border-soft)' }} />
            )}
          </div>
        ))}
      </div>

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div>
            <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Selecionar ou cadastrar aluno
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Busque pelo nome do aluno ou cadastre um novo.
            </p>
          </div>

          {!modoNovo && (
            <>
              <div className="flex gap-2">
                <input
                  value={busca}
                  onChange={e => { setBusca(e.target.value); setAlunoSelecionado(null) }}
                  onKeyDown={e => e.key === 'Enter' && buscarAlunos()}
                  placeholder="Buscar aluno pelo nome..."
                  style={{ ...inputSelectStyle, flex: 1 }}
                />
                <Button variant="secondary" loading={buscando} onClick={buscarAlunos}>
                  Buscar
                </Button>
              </div>

              {resultados.length > 0 && !alunoSelecionado && (
                <div
                  className="rounded-lg overflow-hidden"
                  style={{ border: '1px solid var(--border-soft)' }}
                >
                  {resultados.map(a => (
                    <button
                      key={a.id}
                      onClick={() => selecionarAluno(a)}
                      className="w-full text-left px-4 py-3 text-sm transition-colors"
                      style={{ borderBottom: '1px solid var(--border-soft)', background: 'var(--surface)' }}
                    >
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{a.nome_completo}</span>
                      {a.matricula && (
                        <span className="ml-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                          #{a.matricula}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {alunoSelecionado && (
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-lg"
                  style={{ background: 'var(--green-50,#f0fdf4)', border: '1px solid var(--green-200,#bbf7d0)' }}
                >
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {alunoSelecionado.nome_completo}
                    </p>
                    {alunoSelecionado.matricula && (
                      <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                        #{alunoSelecionado.matricula}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => { setAlunoSelecionado(null); setBusca('') }}
                    className="text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Trocar
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: 'var(--border-soft)' }} />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>ou</span>
                <div className="flex-1 h-px" style={{ background: 'var(--border-soft)' }} />
              </div>

              <button
                onClick={() => setModoNovo(true)}
                className="text-sm font-medium px-4 py-2.5 rounded-lg border-dashed w-full"
                style={{ border: '1.5px dashed var(--border)', color: 'var(--text-muted)' }}
              >
                + Cadastrar novo aluno
              </button>
            </>
          )}

          {modoNovo && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Novo Aluno</p>
                <button onClick={() => setModoNovo(false)} className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Buscar existente
                </button>
              </div>
              <Input
                label="Nome Completo *"
                value={novoAluno.nome_completo}
                onChange={e => setNovoAluno(f => ({ ...f, nome_completo: e.target.value }))}
                placeholder="Nome completo do aluno"
              />
              <Input
                label="Data de Nascimento *"
                type="date"
                value={novoAluno.data_nascimento}
                onChange={e => setNovoAluno(f => ({ ...f, data_nascimento: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="CPF"
                  value={novoAluno.cpf}
                  onChange={e => setNovoAluno(f => ({ ...f, cpf: e.target.value }))}
                  placeholder="000.000.000-00"
                  hint="Opcional"
                />
                <Input
                  label="Código de Matrícula"
                  value={novoAluno.matricula}
                  onChange={e => setNovoAluno(f => ({ ...f, matricula: e.target.value }))}
                  placeholder="Ex: 2027001"
                  hint="Gerado se vazio"
                />
              </div>
            </div>
          )}

          {erroBusca && (
            <p className="text-xs px-3 py-2 rounded-md" style={{ background: 'var(--red-100)', color: 'var(--red-600)' }}>
              {erroBusca}
            </p>
          )}

          <div className="flex justify-end pt-2">
            {modoNovo ? (
              <Button loading={isCreating} onClick={criarNovoAlunoProceder}>
                Cadastrar e continuar →
              </Button>
            ) : (
              <Button
                disabled={!alunoSelecionado}
                onClick={() => alunoSelecionado && setStep(2)}
              >
                Continuar →
              </Button>
            )}
          </div>
        </div>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div className="flex flex-col gap-5">
          <div>
            <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Responsável pelo aluno
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Informe o responsável principal. Mais responsáveis podem ser adicionados depois.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Nome *"
                value={responsavel.nome}
                onChange={e => setResponsavel(f => ({ ...f, nome: e.target.value }))}
                placeholder="Nome completo"
                disabled={pularResp}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Parentesco
                </label>
                <select
                  value={responsavel.parentesco}
                  onChange={e => setResponsavel(f => ({ ...f, parentesco: e.target.value }))}
                  style={inputSelectStyle}
                  disabled={pularResp}
                >
                  {PARENTESCOS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Telefone"
                value={responsavel.telefone}
                onChange={e => setResponsavel(f => ({ ...f, telefone: e.target.value }))}
                placeholder="(11) 99999-9999"
                disabled={pularResp}
              />
              <Input
                label="E-mail"
                type="email"
                value={responsavel.email}
                onChange={e => setResponsavel(f => ({ ...f, email: e.target.value }))}
                placeholder="email@exemplo.com"
                disabled={pularResp}
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={responsavel.financeiro}
                onChange={e => setResponsavel(f => ({ ...f, financeiro: e.target.checked }))}
                disabled={pularResp}
              />
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                Responsável financeiro
              </span>
            </label>
          </div>

          <label className="flex items-center gap-2 cursor-pointer mt-1">
            <input
              type="checkbox"
              checked={pularResp}
              onChange={e => setPularResp(e.target.checked)}
            />
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Pular — cadastrar responsável depois
            </span>
          </label>

          {erroResp && (
            <p className="text-xs px-3 py-2 rounded-md" style={{ background: 'var(--red-100)', color: 'var(--red-600)' }}>
              {erroResp}
            </p>
          )}

          <div className="flex justify-between pt-2">
            <Button variant="secondary" onClick={() => setStep(1)}>← Voltar</Button>
            <Button onClick={validarEAvancarResp}>Continuar →</Button>
          </div>
        </div>
      )}

      {/* ── STEP 3 ── */}
      {step === 3 && (
        <div className="flex flex-col gap-5">
          <div>
            <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Turma e confirmação
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Selecione a turma e revise os dados antes de confirmar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Turma *</label>
              <select value={turmaId} onChange={e => setTurmaId(e.target.value)} style={inputSelectStyle}>
                {turmas.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.nome} — {t.serie} ({TURNO_LABEL[t.turno] ?? t.turno})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Ano Letivo *</label>
              <select value={anoId} onChange={e => setAnoId(e.target.value)} style={inputSelectStyle}>
                {anos.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.ano}{a.ativo ? ' (ativo)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Resumo */}
          <div
            className="flex flex-col gap-3 p-4 rounded-lg"
            style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-soft)' }}
          >
            <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Resumo da matrícula</p>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt style={{ color: 'var(--text-muted)' }}>Aluno</dt>
              <dd style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{alunoSelecionado?.nome_completo}</dd>

              {!pularResp && responsavel.nome && (
                <>
                  <dt style={{ color: 'var(--text-muted)' }}>Responsável</dt>
                  <dd style={{ color: 'var(--text-primary)' }}>{responsavel.nome} ({responsavel.parentesco})</dd>
                </>
              )}

              <dt style={{ color: 'var(--text-muted)' }}>Turma</dt>
              <dd style={{ color: 'var(--text-primary)' }}>{turmaSelecionada?.nome} — {turmaSelecionada?.serie}</dd>

              <dt style={{ color: 'var(--text-muted)' }}>Turno</dt>
              <dd style={{ color: 'var(--text-primary)' }}>{TURNO_LABEL[turmaSelecionada?.turno ?? ''] ?? '—'}</dd>

              <dt style={{ color: 'var(--text-muted)' }}>Ano letivo</dt>
              <dd style={{ color: 'var(--text-primary)' }}>{anoSelecionado?.ano}</dd>
            </dl>
          </div>

          {erroCriacao && (
            <p className="text-xs px-3 py-2 rounded-md" style={{ background: 'var(--red-100)', color: 'var(--red-600)' }}>
              {erroCriacao}
            </p>
          )}

          <div className="flex justify-between pt-2">
            <Button variant="secondary" onClick={() => setStep(2)}>← Voltar</Button>
            <Button loading={isSaving} onClick={finalizar}>
              Confirmar Matrícula
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
