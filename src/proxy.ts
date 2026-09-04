import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseMiddleware } from '@/lib/supabase-middleware'
import type { Papel } from '@/types'

// Rotas públicas que não precisam de autenticação
const PUBLIC_ROUTES = ['/', '/login', '/auth/callback']

// Prefixo de cada portal e os papéis permitidos
const PORTAL_ROLES: Record<string, Papel[]> = {
  '/admin':      ['admin'],
  '/secretaria': ['admin', 'secretaria'],
  '/coordenacao':['admin', 'secretaria', 'coordenador'],
  '/professor':  ['admin', 'secretaria', 'coordenador', 'professor'],
  '/pais':       ['pai'],
}

// Rota padrão por papel após login
const PAPEL_HOME: Record<Papel, string> = {
  admin:       '/admin',
  secretaria:  '/secretaria',
  coordenador: '/coordenacao',
  professor:   '/professor',
  pai:         '/pais',
}

export async function proxy(request: NextRequest) {
  const { supabase, response } = createSupabaseMiddleware(request)
  const { data: { session } } = await supabase.auth.getSession()
  const path = request.nextUrl.pathname

  // Rota pública → deixa passar
  if (PUBLIC_ROUTES.some(r => path === r || path.startsWith(r + '/'))) {
    // Se já logado e for para /login, redireciona para o portal
    if (session && path === '/login') {
      const { data: perfil } = await supabase
        .from('perfis')
        .select('role')
        .eq('id', session.user.id)
        .single()

      const papel = (perfil as any)?.role as Papel | undefined
      if (papel && PAPEL_HOME[papel]) {
        return NextResponse.redirect(new URL(PAPEL_HOME[papel], request.url))
      }
      // sem perfil → deixa renderizar o login normalmente
      return response
    }
    return response
  }

  // Sem sessão → redireciona para login
  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }

  // Busca o papel do usuário
  const { data: perfil } = await supabase
    .from('perfis')
    .select('role, ativo')
    .eq('id', session.user.id)
    .single()

  // Usuário sem perfil ou inativo
  if (!perfil || !perfil.ativo) {
    return NextResponse.redirect(new URL('/login?erro=acesso_negado', request.url))
  }

  const papel = perfil.role as Papel

  // Verifica permissão para o portal solicitado
  for (const [prefix, roles] of Object.entries(PORTAL_ROLES)) {
    if (path.startsWith(prefix) && !roles.includes(papel)) {
      const home = PAPEL_HOME[papel]
      return NextResponse.redirect(new URL(home, request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
