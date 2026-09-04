// BotConversa — integração WhatsApp
// Preencher BOTCONVERSA_API_KEY no .env.local quando a conta estiver configurada
// Docs: https://docs.botconversa.com.br

const API_KEY = process.env.BOTCONVERSA_API_KEY ?? ''
const BASE_URL = 'https://backend.botconversa.com.br/api/v1'

export async function sendWhatsApp(phone: string, message: string): Promise<void> {
  if (!API_KEY) throw new Error('BOTCONVERSA_API_KEY não configurada.')

  // normaliza telefone para formato internacional sem +
  const tel = phone.replace(/\D/g, '').replace(/^0/, '')

  const res = await fetch(`${BASE_URL}/webhook/send-text/`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': API_KEY },
    body: JSON.stringify({ phone: tel, message }),
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`BotConversa: ${res.status} — ${txt}`)
  }
}

export async function sendWhatsAppTemplate(
  phone: string,
  templateName: string,
  variables: Record<string, string>
): Promise<void> {
  if (!API_KEY) throw new Error('BOTCONVERSA_API_KEY não configurada.')

  const tel = phone.replace(/\D/g, '').replace(/^0/, '')

  const res = await fetch(`${BASE_URL}/webhook/send-template/`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': API_KEY },
    body: JSON.stringify({ phone: tel, template_name: templateName, variables }),
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`BotConversa: ${res.status} — ${txt}`)
  }
}
