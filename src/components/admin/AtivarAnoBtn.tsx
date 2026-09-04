'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { ativarAnoLetivo } from '@/actions/turmas'

interface Props { anoId: string; ano: number }

export function AtivarAnoBtn({ anoId, ano }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function ativar() {
    if (!confirm(`Ativar ${ano} como ano letivo vigente?`)) return
    startTransition(async () => {
      await ativarAnoLetivo(anoId)
      router.refresh()
    })
  }

  return (
    <Button size="sm" variant="secondary" loading={isPending} onClick={ativar}>
      Ativar
    </Button>
  )
}
