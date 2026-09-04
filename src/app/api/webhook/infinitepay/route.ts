import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const body = await req.json()

    // InfinitePay envia: status, external_id (= mensalidade id), transaction_nsu, amount
    if (body.status !== 'approved' && body.status !== 'paid') {
      return NextResponse.json({ ok: true })
    }

    const mensalidadeId = body.external_id ?? body.order_nsu
    if (!mensalidadeId) return NextResponse.json({ ok: true })

    const hoje = new Date().toISOString().split('T')[0]
    const valorPago = body.amount ? body.amount / 100 : null

    await sb
      .from('mensalidades')
      .update({
        status:    'pago',
        pago_em:   hoje,
        valor_pago: valorPago,
        atualizado_em: new Date().toISOString(),
      })
      .eq('id', mensalidadeId)
      .in('status', ['pendente', 'atrasado'])

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
