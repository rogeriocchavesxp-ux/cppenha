import Link from 'next/link'
import { redirect } from 'next/navigation'
import { sendEmail } from '@/lib/mailer'

export const metadata = {
  title: 'Colégio Presbiteriano da Penha',
  description: 'Educação Clássica Cristã. Formando caráter para a eternidade.',
}

async function enviarCurriculo(formData: FormData) {
  'use server'

  const nome     = formData.get('nome')?.toString().trim() ?? ''
  const email    = formData.get('email')?.toString().trim() ?? ''
  const telefone = formData.get('telefone')?.toString().trim() ?? ''
  const area     = formData.get('area')?.toString().trim() ?? ''
  const mensagem = formData.get('mensagem')?.toString().trim() ?? ''

  if (!nome || !email || !area) return redirect('/?erro=campos')

  const html = `
    <h2 style="font-family:Georgia,serif;color:#0D2A4D;">Currículo recebido — Trabalhe Conosco</h2>
    <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
      <tr style="background:#F0F6FF;"><td style="padding:10px 14px;font-weight:600;width:180px;">Nome</td><td style="padding:10px 14px;">${nome}</td></tr>
      <tr><td style="padding:10px 14px;font-weight:600;">E-mail</td><td style="padding:10px 14px;">${email}</td></tr>
      <tr style="background:#F0F6FF;"><td style="padding:10px 14px;font-weight:600;">Telefone</td><td style="padding:10px 14px;">${telefone || '—'}</td></tr>
      <tr><td style="padding:10px 14px;font-weight:600;">Área de interesse</td><td style="padding:10px 14px;">${area}</td></tr>
      ${mensagem ? `<tr style="background:#F0F6FF;"><td style="padding:10px 14px;font-weight:600;">Perfil / Mensagem</td><td style="padding:10px 14px;">${mensagem}</td></tr>` : ''}
    </table>
    <p style="font-size:12px;color:#9CA3AF;margin-top:24px;">Recebido via site CPP — ${new Date().toLocaleString('pt-BR')}</p>
  `

  await sendEmail({
    to: process.env.EMAIL_FROM ?? 'contato@cppenha.com.br',
    subject: `Currículo — ${area} — ${nome}`,
    html,
  })

  redirect('/?enviado=1')
}

interface PageProps {
  searchParams: Promise<{ enviado?: string; erro?: string }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const params  = await searchParams
  const enviado = params.enviado === '1'
  const erro    = params.erro === 'campos'

  return (
    <div style={{ background: '#0D2A4D', minHeight: '100vh', color: '#fff', fontFamily: "'EB Garamond', Georgia, serif" }}>

      {/* Fontes */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />

      {/* Entrar — fixo no canto */}
      <div style={{ position: 'fixed', top: '24px', right: '28px', zIndex: 50 }}>
        <Link
          href="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '8px 22px',
            borderRadius: '4px',
            border: '1px solid rgba(201,168,74,0.5)',
            color: '#C9A84A',
            fontSize: '11px',
            fontFamily: "'Cinzel', Georgia, serif",
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            background: 'rgba(13,42,77,0.6)',
            backdropFilter: 'blur(6px)',
          }}
        >
          Entrar
        </Link>
      </div>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '80px 24px 96px',
          maxWidth: '820px',
          margin: '0 auto',
        }}
      >

        {/* Cartão institucional com a logo completa */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '10px',
            padding: '32px 48px',
            marginBottom: '60px',
            boxShadow: '0 40px 96px rgba(0,0,0,0.5), 0 12px 32px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15)',
            borderBottom: '3px solid #C9A84A',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-cpp.png"
            alt="Colégio Presbiteriano da Penha"
            style={{ height: '124px', width: 'auto', display: 'block' }}
          />
        </div>

        {/* Linha dourada vertical */}
        <div
          style={{
            width: '1px',
            height: '52px',
            background: 'linear-gradient(to bottom, transparent, rgba(201,168,74,0.65), transparent)',
            marginBottom: '40px',
          }}
        />

        {/* Label "Em breve" */}
        <p
          style={{
            margin: '0 0 20px',
            fontFamily: "'Cinzel', Georgia, serif",
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#C9A84A',
          }}
        >
          Em breve
        </p>

        {/* Headline principal */}
        <h1
          style={{
            margin: '0 0 32px',
            fontFamily: "'Cinzel', Georgia, serif",
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: '0.02em',
            color: '#FFFFFF',
          }}
        >
          Formando Caráter<br />
          <span style={{ color: 'rgba(255,255,255,0.88)' }}>para a Eternidade</span>
        </h1>

        {/* Subtítulo */}
        <p
          style={{
            margin: '0 0 48px',
            fontSize: '18px',
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.58)',
            lineHeight: 1.85,
            maxWidth: '480px',
          }}
        >
          Estamos finalizando os preparativos para abrir nossas portas.
        </p>

        {/* Versículo */}
        <blockquote style={{ margin: 0, padding: 0 }}>
          <p
            style={{
              margin: '0 0 12px',
              fontSize: '16px',
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.9,
              letterSpacing: '-0.01em',
            }}
          >
            "O temor do Senhor é o princípio da sabedoria."
          </p>
          <cite
            style={{
              fontStyle: 'normal',
              fontFamily: "'Cinzel', Georgia, serif",
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#C9A84A',
            }}
          >
            Provérbios 9.10
          </cite>
        </blockquote>
      </section>

      {/* ══════════════════════════════════════════
          DIVISOR
      ══════════════════════════════════════════ */}
      <div
        style={{
          maxWidth: '560px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(201,168,74,0.55)', flexShrink: 0 }} />
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
      </div>

      {/* ══════════════════════════════════════════
          TRABALHE CONOSCO
      ══════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px 108px', maxWidth: '580px', margin: '0 auto' }}>

        {/* Cabeçalho da seção */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <p
            style={{
              margin: '0 0 14px',
              fontFamily: "'Cinzel', Georgia, serif",
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#C9A84A',
            }}
          >
            Oportunidades
          </p>
          <h2
            style={{
              margin: '0 0 18px',
              fontFamily: "'Cinzel', Georgia, serif",
              fontSize: 'clamp(24px, 3.5vw, 36px)',
              fontWeight: 700,
              letterSpacing: '0.02em',
              lineHeight: 1.12,
              color: '#FFFFFF',
            }}
          >
            Trabalhe Conosco
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: '17px',
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.85,
            }}
          >
            Buscamos educadores e colaboradores comprometidos com a fé reformada
            e com a excelência na formação de crianças e jovens.
          </p>
        </div>

        {/* Feedback — enviado */}
        {enviado && (
          <div
            style={{
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.35)',
              borderRadius: '8px',
              padding: '20px 24px',
              marginBottom: '36px',
            }}
          >
            <p style={{ margin: 0, fontFamily: "'Cinzel', Georgia, serif", fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em', color: '#6EE7B7' }}>
              Currículo enviado com sucesso!
            </p>
            <p style={{ margin: '8px 0 0', fontSize: '15px', fontStyle: 'italic', color: 'rgba(255,255,255,0.55)' }}>
              Entraremos em contato em breve. Que o Senhor abençoe sua jornada.
            </p>
          </div>
        )}

        {/* Feedback — erro */}
        {erro && (
          <div
            style={{
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.35)',
              borderRadius: '8px',
              padding: '20px 24px',
              marginBottom: '36px',
            }}
          >
            <p style={{ margin: 0, fontFamily: "'Cinzel', Georgia, serif", fontSize: '13px', fontWeight: 600, color: '#FCA5A5' }}>
              Preencha os campos obrigatórios.
            </p>
          </div>
        )}

        {/* Formulário */}
        <form action={enviarCurriculo} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '22px' }}>
            <label style={fieldStyle}>
              <span style={labelStyle}>Nome completo *</span>
              <input name="nome" type="text" required placeholder="Seu nome" style={inputStyle} />
            </label>
            <label style={fieldStyle}>
              <span style={labelStyle}>E-mail *</span>
              <input name="email" type="email" required placeholder="seu@email.com" style={inputStyle} />
            </label>
          </div>

          <label style={fieldStyle}>
            <span style={labelStyle}>Telefone / WhatsApp</span>
            <input name="telefone" type="tel" placeholder="(11) 00000-0000" style={inputStyle} />
          </label>

          <label style={fieldStyle}>
            <span style={labelStyle}>Área de interesse *</span>
            <select name="area" required style={{ ...inputStyle, color: 'rgba(255,255,255,0.8)' }}>
              <option value="" style={{ background: '#0D2A4D' }}>Selecione uma área</option>
              <option style={{ background: '#0D2A4D' }}>Professor — Anos Iniciais (1º ao 5º ano)</option>
              <option style={{ background: '#0D2A4D' }}>Professor — Anos Finais (6º ao 9º ano)</option>
              <option style={{ background: '#0D2A4D' }}>Professor — Ensino Médio</option>
              <option style={{ background: '#0D2A4D' }}>Coordenação Pedagógica</option>
              <option style={{ background: '#0D2A4D' }}>Secretaria / Administrativo</option>
              <option style={{ background: '#0D2A4D' }}>Auxiliar de Classe</option>
              <option style={{ background: '#0D2A4D' }}>Outros</option>
            </select>
          </label>

          <label style={fieldStyle}>
            <span style={labelStyle}>Perfil / Apresentação</span>
            <textarea
              name="mensagem"
              rows={5}
              placeholder="Conte um pouco sobre sua formação, experiência e motivação para trabalhar em uma escola cristã clássica..."
              style={{ ...inputStyle, resize: 'vertical', fontFamily: "'EB Garamond', Georgia, serif", lineHeight: 1.7 }}
            />
          </label>

          {/* CTA */}
          <button
            type="submit"
            style={{
              marginTop: '6px',
              padding: '16px',
              borderRadius: '6px',
              background: '#FFFFFF',
              color: '#0D2A4D',
              fontFamily: "'Cinzel', Georgia, serif",
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Enviar Currículo
          </button>

          <p
            style={{
              margin: 0,
              fontSize: '13px',
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.3)',
              textAlign: 'center',
            }}
          >
            Seus dados serão usados apenas para contato referente a esta oportunidade.
          </p>
        </form>
      </section>

      {/* ══════════════════════════════════════════
          RODAPÉ
      ══════════════════════════════════════════ */}
      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '28px 24px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "'Cinzel', Georgia, serif",
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.2)',
          }}
        >
          Colégio Presbiteriano da Penha — Educação Clássica Cristã
        </p>
      </footer>

    </div>
  )
}

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}

const labelStyle: React.CSSProperties = {
  fontFamily: "'Cinzel', Georgia, serif",
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.55)',
}

const inputStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: '6px',
  border: '1px solid rgba(201,168,74,0.22)',
  background: 'rgba(255,255,255,0.05)',
  color: '#FFFFFF',
  fontSize: '16px',
  fontFamily: "'EB Garamond', Georgia, serif",
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}
