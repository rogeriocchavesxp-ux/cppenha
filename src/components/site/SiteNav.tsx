import Link from 'next/link'

const NAV = [
  { label: 'Início',      href: '/' },
  { label: 'Metodologia', href: '/metodologia' },
  { label: 'Matrícula',   href: '/matricula' },
]

export function SiteNav() {
  return (
    <header style={{ background: '#0D2A4D', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cinzel',Georgia,serif", fontWeight: 700, color: '#fff', fontSize: '13px' }}>
            CPP
          </div>
          <div>
            <p style={{ margin: 0, fontFamily: "'Cinzel',Georgia,serif", fontSize: '14px', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>Colégio Presbiteriano</p>
            <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,0.55)', letterSpacing: '.1em', textTransform: 'uppercase' }}>da Penha</p>
          </div>
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {NAV.map(item => (
            <Link key={item.href} href={item.href} style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
              {item.label}
            </Link>
          ))}
          <Link href="/login" style={{ marginLeft: '8px', padding: '7px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#0D2A4D', background: '#fff', textDecoration: 'none' }}>
            Portal
          </Link>
        </nav>
      </div>
    </header>
  )
}
