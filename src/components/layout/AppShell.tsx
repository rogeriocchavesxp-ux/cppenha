import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import type { Papel } from '@/types'

type Props = {
  papel: Papel
  nomeUsuario: string
  titulo: string
  breadcrumb?: { label: string; href?: string }[]
  children: React.ReactNode
}

export function AppShell({ papel, nomeUsuario, titulo, breadcrumb, children }: Props) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      <Sidebar papel={papel} nomeUsuario={nomeUsuario} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar titulo={titulo} breadcrumb={breadcrumb} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
