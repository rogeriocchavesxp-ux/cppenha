import Link from 'next/link'
import { SiteNav } from '@/components/site/SiteNav'
import { SiteFooter } from '@/components/site/SiteFooter'

const DIFERENCIAIS = [
  {
    titulo: 'Metodologia Clássica',
    texto: 'Seguimos o trivium — Gramática, Dialética e Retórica — formando pensadores críticos, articulados e fundamentados.',
  },
  {
    titulo: 'Educação Cristã',
    texto: 'A fé reformada permeia todo o currículo. Ensinamos que o conhecimento verdadeiro começa no temor do Senhor.',
  },
  {
    titulo: 'Excelência Acadêmica',
    texto: 'Nossos alunos dominam as grandes obras da humanidade, desenvolvendo vocabulário, lógica e eloquência superiores.',
  },
  {
    titulo: 'Comunidade e Caráter',
    texto: 'Formamos cidadãos íntegros, prontos para servir à família, à igreja e à sociedade com sabedoria e virtude.',
  },
]

export const metadata = {
  title: 'Colégio Presbiteriano da Penha — Educação Clássica Cristã',
  description: 'Formando caracteres para a eternidade através da educação clássica cristã. Conheça nossa metodologia e garanta a vaga do seu filho.',
}

export default function HomePage() {
  return (
    <div style={{ background: '#FFFFFF', color: '#1F2937', minHeight: '100vh' }}>
      <SiteNav />

      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0D2A4D 0%, #1A4070 60%, #0D2A4D 100%)',
          padding: '100px 24px 96px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decoração geométrica */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <p style={{ margin: '0 0 20px', fontSize: '12px', fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
            Educação Clássica Cristã · Penha, São Paulo
          </p>
          <h1
            style={{
              margin: '0 0 24px',
              fontFamily: "'Cinzel', Georgia, 'Times New Roman', serif",
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.15,
              textWrap: 'balance',
            }}
          >
            Formando Caracteres<br />para a Eternidade
          </h1>
          <p style={{ margin: '0 0 40px', fontSize: '18px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, maxWidth: '600px', marginInline: 'auto' }}>
            O Colégio Presbiteriano da Penha une a excelência da metodologia clássica à solidez da fé reformada, preparando jovens para pensar, falar e viver com sabedoria.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/matricula"
              style={{ padding: '14px 32px', borderRadius: '8px', background: '#FFFFFF', color: '#0D2A4D', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}
            >
              Pré-matrícula 2027
            </Link>
            <Link
              href="/metodologia"
              style={{ padding: '14px 32px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', fontWeight: 600, fontSize: '15px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Conhecer a metodologia
            </Link>
          </div>
        </div>
      </section>

      {/* Versículo */}
      <section style={{ background: '#F9FAFB', padding: '48px 24px', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ margin: 0, fontFamily: "'Cinzel',Georgia,serif", fontSize: 'clamp(16px,2.5vw,22px)', color: '#0D2A4D', lineHeight: 1.6, fontStyle: 'italic' }}>
            "O temor do Senhor é o princípio da sabedoria,<br />
            e o conhecimento do Santo é a prudência."
          </p>
          <p style={{ margin: '12px 0 0', fontSize: '13px', color: '#9CA3AF', letterSpacing: '.05em' }}>Provérbios 9.10</p>
        </div>
      </section>

      {/* Sobre */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '64px', alignItems: 'center' }}>
          <div>
            <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', color: '#2E6BAD' }}>Sobre o Colégio</p>
            <h2 style={{ margin: '0 0 20px', fontFamily: "'Cinzel',Georgia,serif", fontSize: 'clamp(24px,3vw,36px)', color: '#0D2A4D', lineHeight: 1.2 }}>
              Uma escola diferente,<br />com um propósito eterno
            </h2>
            <p style={{ margin: '0 0 16px', fontSize: '15px', lineHeight: 1.8, color: '#4B5563' }}>
              Fundado sobre princípios presbiterianos reformados, o CPP oferece uma educação que vai além das notas. Aqui, os alunos aprendem a ler os grandes clássicos, a argumentar com lógica e a expressar ideias com clareza e beleza.
            </p>
            <p style={{ margin: '0 0 32px', fontSize: '15px', lineHeight: 1.8, color: '#4B5563' }}>
              Nossa missão é formar não apenas estudantes, mas pessoas de caráter: filhos e filhas obedientes, cidadãos responsáveis, servos fiéis da obra de Deus no mundo.
            </p>
            <Link href="/metodologia" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '8px', background: '#0D2A4D', color: '#fff', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>
              Conheça nossa metodologia
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { n: '3', l: 'Níveis de ensino' },
              { n: '100%', l: 'Fundamentado na Escritura' },
              { n: 'Trivium', l: 'Metodologia Clássica' },
              { n: '2027', l: 'Vagas abertas' },
            ].map(item => (
              <div
                key={item.l}
                style={{ background: '#F0F6FF', borderRadius: '12px', padding: '24px 20px', border: '1px solid #D6E5F3' }}
              >
                <p style={{ margin: '0 0 4px', fontFamily: "'Cinzel',Georgia,serif", fontSize: '28px', fontWeight: 700, color: '#0D2A4D' }}>{item.n}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: 1.4 }}>{item.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section style={{ background: '#F9FAFB', padding: '80px 24px', borderTop: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', color: '#2E6BAD' }}>Por que o CPP</p>
            <h2 style={{ margin: 0, fontFamily: "'Cinzel',Georgia,serif", fontSize: 'clamp(22px,3vw,34px)', color: '#0D2A4D' }}>
              Uma educação que forma o todo
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '24px' }}>
            {DIFERENCIAIS.map((d, i) => (
              <div
                key={d.titulo}
                style={{ background: '#FFFFFF', borderRadius: '12px', padding: '32px 28px', border: '1px solid #E5E7EB', borderTop: '3px solid #0D2A4D' }}
              >
                <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#9CA3AF' }}>
                  0{i + 1}
                </p>
                <h3 style={{ margin: '0 0 12px', fontFamily: "'Cinzel',Georgia,serif", fontSize: '17px', color: '#0D2A4D' }}>{d.titulo}</h3>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.75, color: '#6B7280' }}>{d.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0D2A4D', padding: '80px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 16px', fontFamily: "'Cinzel',Georgia,serif", fontSize: 'clamp(22px,3vw,34px)', color: '#FFFFFF' }}>
            Garanta a vaga do seu filho em 2027
          </h2>
          <p style={{ margin: '0 0 36px', fontSize: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
            As vagas são limitadas. Preencha o formulário de pré-matrícula e nossa equipe entrará em contato para dar continuidade ao processo.
          </p>
          <Link
            href="/matricula"
            style={{ display: 'inline-block', padding: '16px 40px', borderRadius: '8px', background: '#FFFFFF', color: '#0D2A4D', fontWeight: 700, fontSize: '16px', textDecoration: 'none' }}
          >
            Fazer pré-matrícula
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
