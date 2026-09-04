'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import type { Papel, NavItem } from '@/types'

const NAV_ITEMS: NavItem[] = [
  // Admin / Secretaria
  { label: 'Dashboard',     href: '/admin',              roles: ['admin'] },
  { label: 'Dashboard',     href: '/secretaria',         roles: ['secretaria'] },
  { label: 'Alunos',        href: '/secretaria/alunos',  roles: ['admin', 'secretaria', 'coordenador'] },
  { label: 'Turmas',        href: '/secretaria/turmas',  roles: ['admin', 'secretaria', 'coordenador'] },
  { label: 'Matrículas',    href: '/secretaria/matriculas', roles: ['admin', 'secretaria'] },
  // Coordenação
  { label: 'Dashboard',     href: '/coordenacao',        roles: ['coordenador'] },
  { label: 'Disciplinas',   href: '/coordenacao/disciplinas', roles: ['admin', 'coordenador'] },
  // Professor
  { label: 'Minhas Turmas', href: '/professor',          roles: ['professor'] },
  { label: 'Notas',         href: '/professor/notas',    roles: ['professor'] },
  { label: 'Chamada',       href: '/professor/chamada',  roles: ['professor'] },
  // Pais
  { label: 'Início',        href: '/pais',               roles: ['pai'] },
  { label: 'Boletim',       href: '/pais/boletim',       roles: ['pai'] },
  { label: 'Frequência',    href: '/pais/frequencia',    roles: ['pai'] },
  { label: 'Financeiro',    href: '/pais/financeiro',    roles: ['pai'] },
  // Compartilhados
  { label: 'Comunicados',   href: '/comunicados',        roles: ['admin', 'secretaria', 'coordenador', 'professor', 'pai'] },
  { label: 'Calendário',    href: '/calendario',         roles: ['admin', 'secretaria', 'coordenador', 'professor', 'pai'] },
  // Admin
  { label: 'Financeiro',    href: '/admin/financeiro',   roles: ['admin', 'secretaria'] },
  { label: 'Colaboradores', href: '/admin/colaboradores',roles: ['admin'] },
  { label: 'Configurações', href: '/admin/configuracoes',roles: ['admin'] },
]

type Props = {
  papel: Papel
  nomeUsuario: string
}

export function Sidebar({ papel, nomeUsuario }: Props) {
  const pathname = usePathname()
  const items = NAV_ITEMS.filter(i => i.roles.includes(papel))

  return (
    <aside
      style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }}
      className="flex flex-col w-60 shrink-0 h-screen sticky top-0"
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-4"
        style={{ borderBottom: '1px solid var(--sidebar-border)' }}
      >
        <Image
          src="/logo-escudo.jpeg"
          alt="CPP"
          width={40}
          height={48}
          className="shrink-0"
          style={{ mixBlendMode: 'screen', objectFit: 'contain' }}
        />
        <div>
          <p className="font-display text-white text-xs font-semibold leading-tight tracking-wide">
            Colégio Presbiteriano
          </p>
          <p style={{ color: 'var(--gold-500)', fontSize: '10px', letterSpacing: '.12em', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
            da Penha
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
        {items.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
              style={{
                color: active ? '#FFFFFF' : 'var(--sidebar-text)',
                background: active ? 'var(--sidebar-active)' : 'transparent',
              }}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Usuário */}
      <div
        className="px-4 py-4"
        style={{ borderTop: '1px solid var(--sidebar-border)' }}
      >
        <p className="text-white text-sm font-medium truncate">{nomeUsuario}</p>
        <p
          className="text-xs capitalize mt-0.5"
          style={{ color: 'var(--sidebar-text)' }}
        >
          {papel}
        </p>
      </div>
    </aside>
  )
}
