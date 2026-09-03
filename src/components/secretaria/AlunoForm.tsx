'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { criarAluno, atualizarAluno } from '@/actions/alunos'
import type { Aluno } from '@/types'

type Props = { aluno?: Aluno }

export function AlunoForm({ aluno }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const editando = !!aluno

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro(null)
    setLoading(true)
    const fd = new FormData(e.currentTarget)

    const dados = {
      nome_completo:   fd.get('nome_completo') as string,
      data_nascimento: fd.get('data_nascimento') as string,
      cpf:             (fd.get('cpf') as string) || undefined,
      matricula:       (fd.get('matricula') as string) || undefined,
    }

    try {
      if (editando) {
        await atualizarAluno(aluno.id, dados)
        router.push(`/secretaria/alunos/${aluno.id}`)
      } else {
        const novo = await criarAluno(dados)
        router.push(`/secretaria/alunos/${novo.id}`)
      }
    } catch (err: any) {
      setErro(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nome Completo"
        name="nome_completo"
        required
        defaultValue={aluno?.nome_completo}
        placeholder="Nome completo do aluno"
      />
      <Input
        label="Data de Nascimento"
        name="data_nascimento"
        type="date"
        required
        defaultValue={aluno?.data_nascimento}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="CPF"
          name="cpf"
          defaultValue={aluno?.cpf ?? ''}
          placeholder="000.000.000-00"
          hint="Opcional"
        />
        <Input
          label="Código de Matrícula"
          name="matricula"
          defaultValue={aluno?.matricula ?? ''}
          placeholder="Ex: 2027001"
          hint="Opcional — gerado automaticamente se vazio"
        />
      </div>

      {erro && (
        <p className="text-xs px-3 py-2 rounded-md" style={{ background: 'var(--red-100)', color: 'var(--red-600)' }}>
          {erro}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancelar</Button>
        <Button type="submit" loading={loading}>
          {editando ? 'Salvar Alterações' : 'Cadastrar Aluno'}
        </Button>
      </div>
    </form>
  )
}
