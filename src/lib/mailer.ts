import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST ?? 'smtp.hostinger.com',
  port:   parseInt(process.env.SMTP_PORT ?? '465', 10),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export type EmailPayload = {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail(payload: EmailPayload) {
  return transporter.sendMail({
    from:    process.env.EMAIL_FROM ?? 'contato@cppenha.com.br',
    to:      Array.isArray(payload.to) ? payload.to.join(', ') : payload.to,
    subject: payload.subject,
    html:    payload.html,
    replyTo: payload.replyTo ?? process.env.SMTP_USER,
  })
}

export function emailLayout(conteudo: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Colégio Presbiteriano da Penha</title>
</head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:8px;overflow:hidden;border:1px solid #E5E7EB;">

        <!-- Cabeçalho -->
        <tr>
          <td style="background:#0D2A4D;padding:28px 32px;">
            <p style="margin:0;font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#FFFFFF;letter-spacing:.5px;">
              Colégio Presbiteriano da Penha
            </p>
            <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.65);letter-spacing:.12em;text-transform:uppercase;">
              Educação com excelência e fé
            </p>
          </td>
        </tr>

        <!-- Conteúdo -->
        <tr>
          <td style="padding:32px;">
            ${conteudo}
          </td>
        </tr>

        <!-- Rodapé -->
        <tr>
          <td style="background:#F9FAFB;padding:20px 32px;border-top:1px solid #E5E7EB;">
            <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.6;">
              Este é um email automático do sistema do Colégio Presbiteriano da Penha.<br/>
              Em caso de dúvidas, entre em contato: <a href="mailto:contato@cppenha.com.br" style="color:#0D2A4D;">contato@cppenha.com.br</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}
