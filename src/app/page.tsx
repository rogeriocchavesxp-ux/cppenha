import Link from 'next/link'
import { redirect } from 'next/navigation'
import { sendEmail } from '@/lib/mailer'

export const metadata = {
  title: 'Colégio Presbiteriano da Penha — Em breve',
  description: 'Estamos preparando algo especial. Em breve, o Colégio Presbiteriano da Penha estará no ar.',
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
    <div style={{ background: '#0D2A4D', minHeight: '100vh', color: '#fff', fontFamily: "'Montserrat', Arial, sans-serif" }}>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <header style={{ padding: '32px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cinzel',Georgia,serif", fontWeight: 700, fontSize: '14px' }}>
            CPP
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: 0, fontFamily: "'Cinzel',Georgia,serif", fontSize: '15px', fontWeight: 600, lineHeight: 1.2 }}>Colégio Presbiteriano da Penha</p>
            <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Educação Clássica Cristã</p>
          </div>
        </div>
        <Link href="/login" style={{ padding: '8px 20px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)' }}>
          Entrar
        </Link>
      </header>

      {/* Hero */}
      <section style={{ padding: '80px 24px 72px', textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <p style={{ margin: '0 0 16px', fontSize: '11px', fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
          Em breve
        </p>
        <h1 style={{ margin: '0 0 24px', fontFamily: "'Cinzel',Georgia,serif", fontSize: 'clamp(28px,5vw,52px)', fontWeight: 700, lineHeight: 1.15, textWrap: 'balance' }}>
          Formando Caracteres<br />para a Eternidade
        </h1>
        <p style={{ margin: '0 0 8px', fontSize: '17px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.75 }}>
          Estamos finalizando os preparativos para abrir nossas portas.
        </p>
        <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: 'rgba(255,255,255,0.4)' }}>
          "O temor do Senhor é o princípio da sabedoria." — Pv 9.10
        </p>
      </section>

      {/* Divisor */}
      <div style={{ maxWidth: '500px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.1)' }} />

      {/* Trabalhe Conosco */}
      <section style={{ padding: '72px 24px 96px', maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Oportunidades</p>
          <h2 style={{ margin: '0 0 12px', fontFamily: "'Cinzel',Georgia,serif", fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700 }}>
            Trabalhe Conosco
          </h2>
          <p style={{ margin: 0, fontSize: '15px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75 }}>
            Buscamos educadores e colaboradores comprometidos com a fé reformada e com a excelência na formação de crianças e jovens.
          </p>
        </div>

        {enviado && (
          <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '10px', padding: '18px 22px', marginBottom: '32px' }}>
            <p style={{ margin: 0, fontWeight: 600, color: '#6EE7B7' }}>Currículo enviado com sucesso!</p>
            <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Entraremos em contato em breve. Que o Senhor abençoe sua jornada.</p>
          </div>
        )}

        {erro && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '10px', padding: '18px 22px', marginBottom: '32px' }}>
            <p style={{ margin: 0, fontWeight: 600, color: '#FCA5A5' }}>Preencha os campos obrigatórios.</p>
          </div>
        )}

        <form action={enviarCurriculo} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '16px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={labelStyle}>Nome completo *</span>
              <input name="nome" type="text" required placeholder="Seu nome" style={inputStyle} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={labelStyle}>E-mail *</span>
              <input name="email" type="email" required placeholder="seu@email.com" style={inputStyle} />
            </label>
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={labelStyle}>Telefone / WhatsApp</span>
            <input name="telefone" type="tel" placeholder="(11) 00000-0000" style={inputStyle} />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={labelStyle}>Área de interesse *</span>
            <select name="area" required style={inputStyle}>
              <option value="">Selecione uma área</option>
              <option>Professor — Anos Iniciais (1º ao 5º ano)</option>
              <option>Professor — Anos Finais (6º ao 9º ano)</option>
              <option>Professor — Ensino Médio</option>
              <option>Coordenação Pedagógica</option>
              <option>Secretaria / Administrativo</option>
              <option>Auxiliar de Classe</option>
              <option>Outros</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={labelStyle}>Perfil / Apresentação</span>
            <textarea
              name="mensagem"
              rows={4}
              placeholder="Conte um pouco sobre sua formação, experiência e motivação para trabalhar em uma escola cristã clássica..."
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            />
          </label>

          <button
            type="submit"
            style={{ marginTop: '8px', padding: '14px', borderRadius: '8px', background: '#FFFFFF', color: '#0D2A4D', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer' }}
          >
            Enviar currículo
          </button>

          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
            Seus dados serão usados apenas para contato referente a esta oportunidade.
          </p>
        </form>
      </section>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.7)',
}

const inputStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.15)',
  fontSize: '14px',
  background: 'rgba(255,255,255,0.07)',
  color: '#fff',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}
