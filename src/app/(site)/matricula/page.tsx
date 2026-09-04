import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { sendEmail } from '@/lib/mailer'

export const metadata: Metadata = {
  title: 'Pré-matrícula 2027 — Colégio Presbiteriano da Penha',
  description: 'Preencha o formulário de pré-matrícula e nossa equipe entrará em contato para dar continuidade ao processo.',
}

async function submeterPrematricula(formData: FormData) {
  'use server'

  const nome       = formData.get('nome')?.toString().trim() ?? ''
  const email      = formData.get('email')?.toString().trim() ?? ''
  const telefone   = formData.get('telefone')?.toString().trim() ?? ''
  const nomeAluno  = formData.get('nome_aluno')?.toString().trim() ?? ''
  const anoNasc    = formData.get('ano_nascimento')?.toString().trim() ?? ''
  const serie      = formData.get('serie')?.toString().trim() ?? ''
  const mensagem   = formData.get('mensagem')?.toString().trim() ?? ''

  if (!nome || !email || !nomeAluno || !serie) {
    return redirect('/matricula?erro=campos')
  }

  const html = `
    <h2 style="font-family:Georgia,serif;color:#0D2A4D;">Nova Pré-matrícula — 2027</h2>
    <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
      <tr style="background:#F0F6FF;"><td style="padding:10px 14px;font-weight:600;width:200px;">Responsável</td><td style="padding:10px 14px;">${nome}</td></tr>
      <tr><td style="padding:10px 14px;font-weight:600;">E-mail</td><td style="padding:10px 14px;">${email}</td></tr>
      <tr style="background:#F0F6FF;"><td style="padding:10px 14px;font-weight:600;">Telefone/WhatsApp</td><td style="padding:10px 14px;">${telefone || '—'}</td></tr>
      <tr><td style="padding:10px 14px;font-weight:600;">Nome do Aluno</td><td style="padding:10px 14px;">${nomeAluno}</td></tr>
      <tr style="background:#F0F6FF;"><td style="padding:10px 14px;font-weight:600;">Ano de Nascimento</td><td style="padding:10px 14px;">${anoNasc || '—'}</td></tr>
      <tr><td style="padding:10px 14px;font-weight:600;">Série de Interesse</td><td style="padding:10px 14px;">${serie}</td></tr>
      ${mensagem ? `<tr style="background:#F0F6FF;"><td style="padding:10px 14px;font-weight:600;">Observações</td><td style="padding:10px 14px;">${mensagem}</td></tr>` : ''}
    </table>
    <p style="font-size:12px;color:#9CA3AF;margin-top:24px;">Recebido via site CPP — ${new Date().toLocaleString('pt-BR')}</p>
  `

  await sendEmail({
    to:      process.env.EMAIL_FROM ?? 'contato@cppenha.com.br',
    subject: `Pré-matrícula 2027 — ${nomeAluno}`,
    html,
  })

  redirect('/matricula?enviado=1')
}

interface PageProps {
  searchParams: Promise<{ enviado?: string; erro?: string }>
}

export default async function MatriculaPage({ searchParams }: PageProps) {
  const params  = await searchParams
  const enviado = params.enviado === '1'
  const erro    = params.erro === 'campos'

  return (
    <div style={{ background: '#FFFFFF', color: '#1F2937' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, #0D2A4D 0%, #1A4070 100%)', padding: '72px 24px 64px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ margin: '0 0 16px', fontSize: '12px', fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
            Vagas Limitadas
          </p>
          <h1 style={{ margin: '0 0 20px', fontFamily: "'Cinzel',Georgia,serif", fontSize: 'clamp(26px,4vw,44px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, textWrap: 'balance' }}>
            Pré-matrícula 2027
          </h1>
          <p style={{ margin: 0, fontSize: '17px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
            Preencha o formulário abaixo e nossa equipe entrará em contato em até 2 dias úteis para dar continuidade ao processo.
          </p>
        </div>
      </section>

      {/* Formulário */}
      <section style={{ padding: '72px 24px 96px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>

          {enviado && (
            <div style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: '10px', padding: '20px 24px', marginBottom: '36px' }}>
              <p style={{ margin: 0, fontWeight: 600, color: '#065F46', fontSize: '15px' }}>Formulário enviado com sucesso!</p>
              <p style={{ margin: '6px 0 0', color: '#047857', fontSize: '14px' }}>Recebemos sua solicitação e entraremos em contato em breve. Que o Senhor abençoe sua família.</p>
            </div>
          )}

          {erro && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '10px', padding: '20px 24px', marginBottom: '36px' }}>
              <p style={{ margin: 0, fontWeight: 600, color: '#991B1B', fontSize: '15px' }}>Campos obrigatórios em branco.</p>
              <p style={{ margin: '6px 0 0', color: '#B91C1C', fontSize: '14px' }}>Preencha nome do responsável, e-mail, nome do aluno e série de interesse.</p>
            </div>
          )}

          <div style={{ background: '#F9FAFB', borderRadius: '16px', padding: '40px', border: '1px solid #E5E7EB' }}>
            <p style={{ margin: '0 0 28px', fontFamily: "'Cinzel',Georgia,serif", fontSize: '16px', color: '#0D2A4D', fontWeight: 600 }}>Dados do Responsável</p>
            <form action={submeterPrematricula} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '16px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Nome completo *</span>
                  <input name="nome" type="text" required placeholder="Seu nome" style={inputStyle} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>E-mail *</span>
                  <input name="email" type="email" required placeholder="seu@email.com" style={inputStyle} />
                </label>
              </div>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Telefone / WhatsApp</span>
                <input name="telefone" type="tel" placeholder="(11) 00000-0000" style={inputStyle} />
              </label>

              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '28px' }}>
                <p style={{ margin: '0 0 20px', fontFamily: "'Cinzel',Georgia,serif", fontSize: '16px', color: '#0D2A4D', fontWeight: 600 }}>Dados do Aluno</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Nome completo do aluno *</span>
                  <input name="nome_aluno" type="text" required placeholder="Nome da criança" style={inputStyle} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Ano de nascimento</span>
                  <input name="ano_nascimento" type="number" min="2010" max="2022" placeholder="Ex: 2018" style={inputStyle} />
                </label>
              </div>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Série de interesse *</span>
                <select name="serie" required style={inputStyle}>
                  <option value="">Selecione uma série</option>
                  <optgroup label="Anos Iniciais">
                    <option>1º ano do Ensino Fundamental</option>
                    <option>2º ano do Ensino Fundamental</option>
                    <option>3º ano do Ensino Fundamental</option>
                    <option>4º ano do Ensino Fundamental</option>
                    <option>5º ano do Ensino Fundamental</option>
                  </optgroup>
                  <optgroup label="Anos Finais">
                    <option>6º ano do Ensino Fundamental</option>
                    <option>7º ano do Ensino Fundamental</option>
                    <option>8º ano do Ensino Fundamental</option>
                    <option>9º ano do Ensino Fundamental</option>
                  </optgroup>
                  <optgroup label="Ensino Médio">
                    <option>1º ano do Ensino Médio</option>
                    <option>2º ano do Ensino Médio</option>
                    <option>3º ano do Ensino Médio</option>
                  </optgroup>
                </select>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Mensagem ou observações</span>
                <textarea name="mensagem" rows={4} placeholder="Conte-nos um pouco sobre sua família, ou tire alguma dúvida..." style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
              </label>

              <button
                type="submit"
                style={{ marginTop: '8px', padding: '14px', borderRadius: '8px', background: '#0D2A4D', color: '#fff', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer', width: '100%' }}
              >
                Enviar pré-matrícula
              </button>

              <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF', textAlign: 'center' }}>
                Seus dados serão usados somente para contato referente ao processo de matrícula.
              </p>
            </form>
          </div>

          <div style={{ marginTop: '40px', padding: '28px', borderRadius: '12px', background: '#F0F6FF', border: '1px solid #D6E5F3' }}>
            <p style={{ margin: '0 0 12px', fontFamily: "'Cinzel',Georgia,serif", fontSize: '15px', color: '#0D2A4D', fontWeight: 600 }}>Como funciona o processo?</p>
            <ol style={{ margin: 0, padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Você envia o formulário de pré-matrícula.',
                'Nossa secretaria entra em contato em até 2 dias úteis.',
                'Agendamos uma visita ou entrevista com os pais.',
                'Enviamos a documentação necessária e confirmamos a vaga.',
              ].map((p, i) => (
                <li key={i} style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.6 }}>{p}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid #D1D5DB',
  fontSize: '14px',
  background: '#FFFFFF',
  color: '#1F2937',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}
