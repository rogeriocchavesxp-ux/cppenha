import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import type { Papel } from '@/types'

const PAPEL_HOME: Record<Papel, string> = {
  admin:       '/admin',
  secretaria:  '/secretaria',
  coordenador: '/coordenacao',
  professor:   '/professor',
  pai:         '/pais',
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/login'

  if (code) {
    const supabase = await createSupabaseServer()
    const { data } = await supabase.auth.exchangeCodeForSession(code)

    if (data.session) {
      const { data: perfil } = await supabase
        .from('perfis')
        .select('papel')
        .eq('id', data.session.user.id)
        .single()

      const papel = perfil?.papel as Papel | undefined
      const destino = papel ? PAPEL_HOME[papel] : next
      return NextResponse.redirect(new URL(destino, request.url))
    }
  }

  return NextResponse.redirect(new URL('/login?erro=callback', request.url))
}
