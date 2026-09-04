import { NextRequest, NextResponse } from 'next/server'

// Webhook de entrada do BotConversa
// Configure a URL no painel BotConversa: https://<seu-dominio>/api/webhook/botconversa
// Útil para receber confirmações de leitura, respostas de pais, etc.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // body contém: phone, message, contact_name, etc.
    // Implementar lógica de resposta automática aqui quando necessário
    console.log('[BotConversa webhook]', JSON.stringify(body))
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
