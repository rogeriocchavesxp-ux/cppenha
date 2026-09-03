'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { criarAnoLetivo } from '@/actions/turmas'

export function AnoLetivoForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro(null)
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    try {
      await criarAnoLetivo({
        ano:     Number(fd.get('ano')),
        inicio:  fd.get('inicio') as string,
        termino: fd.get('termino') as string,
        ativo:   fd.get('ativo') === 'on',
      })
      router.refresh()
      ;(e.target as HTMLFormElement).reset()
    } catch (err: any) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Ano" name="ano" type="number" min="2020" max="2050" required placeholder="2027" />
      <Input label="Início" name="inicio" type="date" required />
      <Input label="Término" name="termino" type="date" required />

      <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-primary)' }}>
        <input type="checkbox" name="ativo" className="w-4 h-4 accent-[#0D2A4D]" />
        Definir como ano ativo
      </label>

      {erro && (
        <p className="text-xs px-3 py-2 rounded-md" style={{ background: 'var(--red-100)', color: 'var(--red-600)' }}>
          {erro}
        </p>
      )}

      <Button type="submit" loading={loading}>Criar Ano Letivo</Button>
    </form>
  )
}
