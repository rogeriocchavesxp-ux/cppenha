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
        <div
          className="shrink-0 flex items-center justify-center rounded-xl overflow-hidden"
          style={{ background: '#fff', width: 46, height: 46, padding: 5, boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
        >
          <Image
            src="/logo-escudo.jpeg"
            alt="CPP"
            width={36}
            height={36}
            style={{ objectFit: 'contain', display: 'block' }}
          />
        </div>
        <div>
          <p
            className="font-display text-white font-semibold leading-tight"
            style={{ fontSize: '11px', letterSpacing: '0.06em' }}
          >
            Colégio Presbiteriano
          </p>
          <p
            style={{
              color: 'var(--gold-500)',
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-display)',
              fontWeight: '600',
              marginTop: '2px',
            }}
          >
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
              className="flex items-center py-2 rounded-md text-sm font-medium transition-colors"
              style={{
                color: active ? '#FFFFFF' : 'var(--sidebar-text)',
                background: active ? 'rgba(201,168,74,0.10)' : 'transparent',
                borderLeft: active ? '2px solid var(--gold-500)' : '2px solid transparent',
                paddingLeft: '10px',
                paddingRight: '12px',
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
        <p
          className="text-white font-medium truncate"
          style={{ fontSize: '13px', letterSpacing: '0.01em' }}
        >
          {nomeUsuario}
        </p>
        <p
          className="mt-1 uppercase tracking-widest"
          style={{
            color: 'var(--gold-300)',
            fontSize: '9px',
            letterSpacing: '0.14em',
            fontFamily: 'var(--font-display)',
          }}
        >
          {papel}
        </p>
      </div>
    </aside>
  )
}
