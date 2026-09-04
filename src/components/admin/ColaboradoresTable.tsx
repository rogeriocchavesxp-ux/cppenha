'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { atualizarColaborador, alternarAtivo } from '@/actions/colaboradores'
import type { Papel, Perfil } from '@/types'

interface Props {
  colaboradores: Perfil[]
  currentUserId: string
}

const PAPEL_LABEL: Record<Papel, string> = {
  admin:       'Administrador',
  secretaria:  'Secretaria',
  coordenador: 'Coordenador',
  professor:   'Professor',
  pai:         'Responsável',
}

const PAPEIS_EDITAVEIS: Papel[] = ['admin', 'secretaria', 'coordenador', 'professor']

const selectStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  borderRadius: '6px',
  padding: '6px 10px',
  fontSize: '13px',
  outline: 'none',
}

function ColaboradorRow({ c, isSelf }: { c: Perfil; isSelf: boolean }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editando, setEditando] = useState(false)
  const [nome, setNome] = useState(c.nome)
  const [telefone, setTelefone] = useState(c.telefone ?? '')
  const [papel, setPapel] = useState<Papel>(c.papel)
  const [erro, setErro] = useState<string | null>(null)

  function salvar() {
    startTransition(async () => {
      try {
        await atualizarColaborador(c.id, { nome, telefone: telefone || undefined, papel })
        setEditando(false)
        setErro(null)
        router.refresh()
      } catch (e: any) {
        setErro(e.message)
      }
    })
  }

  function toggleAtivo() {
    startTransition(async () => {
      await alternarAtivo(c.id, !c.ativo)
      router.refresh()
    })
  }

  if (editando) {
    return (
      <tr style={{ borderBottom: '1px solid var(--border-soft)', background: 'var(--surface-raised)' }}>
        <td className="px-5 py-3" colSpan={4}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Nome</label>
              <input value={nome} onChange={e => setNome(e.target.value)} style={selectStyle} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Telefone</label>
              <input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(11) 99999-9999" style={selectStyle} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Papel</label>
              <select value={papel} onChange={e => setPapel(e.target.value as Papel)} style={selectStyle} disabled={isSelf}>
                {PAPEIS_EDITAVEIS.map(p => (
                  <option key={p} value={p}>{PAPEL_LABEL[p]}</option>
                ))}
              </select>
            </div>
          </div>
          {erro && <p className="text-xs mb-2" style={{ color: 'var(--red-600)' }}>{erro}</p>}
          <div className="flex gap-2">
            <Button size="sm" loading={isPending} onClick={salvar}>Salvar</Button>
            <Button size="sm" variant="secondary" onClick={() => { setEditando(false); setErro(null) }}>Cancelar</Button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr style={{ borderBottom: '1px solid var(--border-soft)' }}>
      <td className="px-5 py-3">
        <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{c.nome}</p>
        {c.telefone && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{c.telefone}</p>}
      </td>
      <td className="px-5 py-3">
        <Badge variant={c.papel === 'admin' ? 'warning' : 'info'}>{PAPEL_LABEL[c.papel]}</Badge>
      </td>
      <td className="px-5 py-3">
        <Badge variant={c.ativo ? 'success' : 'default'}>{c.ativo ? 'Ativo' : 'Inativo'}</Badge>
      </td>
      <td className="px-5 py-3">
        <div className="flex gap-4 justify-end">
          <button
            onClick={() => setEditando(true)}
            className="text-xs font-medium"
            style={{ color: 'var(--navy-700)' }}
          >
            Editar
          </button>
          {!isSelf && (
            <button
              onClick={toggleAtivo}
              disabled={isPending}
              className="text-xs font-medium"
              style={{ color: c.ativo ? 'var(--red-600)' : 'var(--green-600)' }}
            >
              {c.ativo ? 'Desativar' : 'Ativar'}
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}

export function ColaboradoresTable({ colaboradores, currentUserId }: Props) {
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {colaboradores.length} colaborador{colaboradores.length !== 1 ? 'es' : ''} cadastrado{colaboradores.length !== 1 ? 's' : ''}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Novos colaboradores são cadastrados via painel Supabase → Authentication.
        </p>
      </div>

      <Card padding="none">
        {colaboradores.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Nenhum colaborador cadastrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  {['Colaborador', 'Papel', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {colaboradores.map(c => (
                  <ColaboradorRow key={c.id} c={c} isSelf={c.id === currentUserId} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  )
}
