'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  criarResponsavel,
  atualizarResponsavel,
  removerResponsavel,
} from '@/actions/responsaveis'

const PARENTESCOS = ['Pai', 'Mãe', 'Avô', 'Avó', 'Tio', 'Tia', 'Padrasto', 'Madrasta', 'Outro']

const selectStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  borderRadius: '6px',
  padding: '8px 12px',
  fontSize: '14px',
  width: '100%',
  outline: 'none',
}

type Responsavel = {
  id: string
  nome: string
  parentesco: string
  telefone?: string | null
  email?: string | null
  financeiro: boolean
}

interface Props {
  alunoId: string
  responsaveis: Responsavel[]
}

type FormState = {
  nome: string
  parentesco: string
  telefone: string
  email: string
  financeiro: boolean
}

const FORM_VAZIO: FormState = { nome: '', parentesco: 'Pai', telefone: '', email: '', financeiro: false }

export function ResponsaveisSection({ alunoId, responsaveis }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [mostrando, setMostrando] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(FORM_VAZIO)
  const [erro, setErro] = useState<string | null>(null)

  function abrirNovo() {
    setEditandoId(null)
    setForm(FORM_VAZIO)
    setErro(null)
    setMostrando(true)
  }

  function abrirEditar(r: Responsavel) {
    setEditandoId(r.id)
    setForm({
      nome:       r.nome,
      parentesco: r.parentesco,
      telefone:   r.telefone ?? '',
      email:      r.email    ?? '',
      financeiro: r.financeiro,
    })
    setErro(null)
    setMostrando(true)
  }

  function cancelar() {
    setMostrando(false)
    setEditandoId(null)
    setForm(FORM_VAZIO)
    setErro(null)
  }

  function salvar() {
    if (!form.nome.trim()) { setErro('Nome é obrigatório.'); return }
    setErro(null)
    startTransition(async () => {
      try {
        if (editandoId) {
          await atualizarResponsavel(editandoId, {
            nome:       form.nome,
            parentesco: form.parentesco,
            telefone:   form.telefone || undefined,
            email:      form.email    || undefined,
            financeiro: form.financeiro,
          })
        } else {
          await criarResponsavel({
            aluno_id:   alunoId,
            nome:       form.nome,
            parentesco: form.parentesco,
            telefone:   form.telefone || undefined,
            email:      form.email    || undefined,
            financeiro: form.financeiro,
          })
        }
        cancelar()
        router.refresh()
      } catch (e: any) {
        setErro(e.message)
      }
    })
  }

  function remover(id: string, nome: string) {
    if (!confirm(`Remover ${nome} como responsável?`)) return
    startTransition(async () => {
      await removerResponsavel(id)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {responsaveis.length === 0 && !mostrando && (
        <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>
          Nenhum responsável cadastrado.
        </p>
      )}

      {responsaveis.map(r => (
        <div
          key={r.id}
          className="flex items-start justify-between gap-4 px-4 py-3 rounded-lg"
          style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-soft)' }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {r.nome}
              </p>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'var(--navy-100)', color: 'var(--navy-700)' }}
              >
                {r.parentesco}
              </span>
              {r.financeiro && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'var(--green-100)', color: 'var(--green-700)' }}
                >
                  Resp. Financeiro
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-1 flex-wrap">
              {r.telefone && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>📞 {r.telefone}</p>
              )}
              {r.email && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>✉ {r.email}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => abrirEditar(r)}
              className="text-xs px-2.5 py-1 rounded-md font-medium transition-colors"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              Editar
            </button>
            <button
              onClick={() => remover(r.id, r.nome)}
              disabled={isPending}
              className="text-xs px-2.5 py-1 rounded-md font-medium transition-colors"
              style={{ background: 'transparent', color: 'var(--red-600)' }}
            >
              Remover
            </button>
          </div>
        </div>
      ))}

      {mostrando && (
        <div
          className="flex flex-col gap-3 p-4 rounded-lg"
          style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-soft)' }}
        >
          <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
            {editandoId ? 'Editar responsável' : 'Novo responsável'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Nome *"
              value={form.nome}
              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              placeholder="Nome completo"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                Parentesco
              </label>
              <select
                value={form.parentesco}
                onChange={e => setForm(f => ({ ...f, parentesco: e.target.value }))}
                style={selectStyle}
              >
                {PARENTESCOS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Telefone"
              value={form.telefone}
              onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))}
              placeholder="(11) 99999-9999"
            />
            <Input
              label="E-mail"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="email@exemplo.com"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.financeiro}
              onChange={e => setForm(f => ({ ...f, financeiro: e.target.checked }))}
            />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
              Responsável financeiro
            </span>
          </label>

          {erro && (
            <p className="text-xs px-3 py-2 rounded-md" style={{ background: 'var(--red-100)', color: 'var(--red-600)' }}>
              {erro}
            </p>
          )}

          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={cancelar} disabled={isPending}>
              Cancelar
            </Button>
            <Button size="sm" loading={isPending} onClick={salvar}>
              {editandoId ? 'Salvar' : 'Adicionar'}
            </Button>
          </div>
        </div>
      )}

      {!mostrando && (
        <button
          onClick={abrirNovo}
          className="text-sm font-medium px-4 py-2.5 rounded-lg border-dashed w-full transition-colors"
          style={{
            border: '1.5px dashed var(--border)',
            color: 'var(--text-muted)',
            background: 'transparent',
          }}
        >
          + Adicionar responsável
        </button>
      )}
    </div>
  )
}
