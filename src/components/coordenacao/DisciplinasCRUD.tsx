'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { criarDisciplina, atualizarDisciplina, excluirDisciplina } from '@/actions/disciplinas'
import type { Disciplina } from '@/types'

interface Props {
  disciplinas: Disciplina[]
}

const selectStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  borderRadius: '6px',
  padding: '7px 10px',
  fontSize: '13px',
  width: '100%',
  outline: 'none',
}

export function DisciplinasCRUD({ disciplinas }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editando, setEditando] = useState<Disciplina | null>(null)
  const [showNovo, setShowNovo] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const [formNome, setFormNome] = useState('')
  const [formCodigo, setFormCodigo] = useState('')
  const [formDescricao, setFormDescricao] = useState('')

  function abrirNovo() {
    setEditando(null)
    setFormNome('')
    setFormCodigo('')
    setFormDescricao('')
    setErro(null)
    setShowNovo(true)
  }

  function abrirEditar(d: Disciplina) {
    setEditando(d)
    setFormNome(d.nome)
    setFormCodigo(d.codigo ?? '')
    setFormDescricao(d.descricao ?? '')
    setErro(null)
    setShowNovo(true)
  }

  function cancelar() {
    setShowNovo(false)
    setEditando(null)
    setErro(null)
  }

  function salvar() {
    if (!formNome.trim()) { setErro('Nome é obrigatório.'); return }
    setErro(null)
    startTransition(async () => {
      try {
        if (editando) {
          await atualizarDisciplina(editando.id, {
            nome: formNome.trim(),
            codigo: formCodigo.trim() || undefined,
            descricao: formDescricao.trim() || undefined,
          })
        } else {
          await criarDisciplina({
            nome: formNome.trim(),
            codigo: formCodigo.trim() || undefined,
            descricao: formDescricao.trim() || undefined,
          })
        }
        setShowNovo(false)
        setEditando(null)
        router.refresh()
      } catch (e: any) {
        setErro(e.message)
      }
    })
  }

  function excluir(id: string) {
    if (!confirm('Excluir esta disciplina? A ação não pode ser desfeita.')) return
    startTransition(async () => {
      try {
        await excluirDisciplina(id)
        router.refresh()
      } catch (e: any) {
        setErro(e.message)
      }
    })
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {disciplinas.length} disciplina{disciplinas.length !== 1 ? 's' : ''} cadastrada{disciplinas.length !== 1 ? 's' : ''}
        </p>
        {!showNovo && (
          <Button size="sm" onClick={abrirNovo}>+ Nova Disciplina</Button>
        )}
      </div>

      {showNovo && (
        <Card className="mb-5">
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            {editando ? 'Editar disciplina' : 'Nova disciplina'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <Input label="Nome *" value={formNome} onChange={e => setFormNome(e.target.value)} placeholder="ex: Matemática" />
            <Input label="Código" value={formCodigo} onChange={e => setFormCodigo(e.target.value)} placeholder="ex: MAT" />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Descrição</label>
              <input
                value={formDescricao}
                onChange={e => setFormDescricao(e.target.value)}
                placeholder="Opcional"
                style={selectStyle}
              />
            </div>
          </div>
          {erro && (
            <p className="text-xs px-3 py-2 rounded-md mb-3" style={{ background: 'var(--red-100)', color: 'var(--red-600)' }}>
              {erro}
            </p>
          )}
          <div className="flex gap-2">
            <Button size="sm" loading={isPending} onClick={salvar}>
              {editando ? 'Salvar' : 'Criar'}
            </Button>
            <Button size="sm" variant="secondary" onClick={cancelar}>Cancelar</Button>
          </div>
        </Card>
      )}

      <Card padding="none">
        {disciplinas.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Nenhuma disciplina cadastrada.</p>
            <Button size="sm" variant="secondary" className="mt-4" onClick={abrirNovo}>
              Criar primeira disciplina
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  {['Nome', 'Código', 'Descrição', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {disciplinas.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                    <td className="px-5 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{d.nome}</td>
                    <td className="px-5 py-3" style={{ color: 'var(--text-secondary)' }}>{d.codigo ?? '—'}</td>
                    <td className="px-5 py-3" style={{ color: 'var(--text-secondary)' }}>{d.descricao ?? '—'}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-4 justify-end">
                        <button onClick={() => abrirEditar(d)} className="text-xs font-medium" style={{ color: 'var(--navy-700)' }}>
                          Editar
                        </button>
                        <button onClick={() => excluir(d.id)} className="text-xs font-medium" style={{ color: 'var(--red-600)' }}>
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  )
}
