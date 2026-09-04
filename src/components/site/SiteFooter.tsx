import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer style={{ background: '#091422', color: 'rgba(255,255,255,0.6)', marginTop: '80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '40px', marginBottom: '40px' }}>
          <div>
            <p style={{ margin: '0 0 8px', fontFamily: "'Cinzel',Georgia,serif", fontSize: '15px', fontWeight: 700, color: '#fff' }}>
              Colégio Presbiteriano da Penha
            </p>
            <p style={{ margin: '0 0 16px', fontSize: '13px', lineHeight: '1.7' }}>
              Educação com excelência, fé e caráter.
            </p>
            <p style={{ margin: 0, fontSize: '12px', fontStyle: 'italic', color: 'rgba(255,255,255,0.35)' }}>
              "O temor do Senhor é o princípio da sabedoria." — Pv 9.10
            </p>
          </div>
          <div>
            <p style={{ margin: '0 0 16px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', color: 'rgba(255,255,255,0.35)' }}>Contato</p>
            <p style={{ margin: '0 0 8px', fontSize: '13px' }}>contato@cppenha.com.br</p>
            <p style={{ margin: '0 0 8px', fontSize: '13px' }}>Penha — São Paulo, SP</p>
          </div>
          <div>
            <p style={{ margin: '0 0 16px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', color: 'rgba(255,255,255,0.35)' }}>Links</p>
            {[
              { label: 'Metodologia Clássica', href: '/metodologia' },
              { label: 'Pré-matrícula',         href: '/matricula' },
              { label: 'Portal do Responsável', href: '/login' },
            ].map(l => (
              <p key={l.href} style={{ margin: '0 0 8px' }}>
                <Link href={l.href} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px' }}>{l.label}</Link>
              </p>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
          © {new Date().getFullYear()} Colégio Presbiteriano da Penha. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
