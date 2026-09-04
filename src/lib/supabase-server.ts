import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServer() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — cookies serão setados pelo middleware
          }
        },
      },
    }
  )
}

export async function getSession() {
  const supabase = await createSupabaseServer()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getPerfil() {
  const session = await getSession()
  if (!session) return null

  const supabase = await createSupabaseServer()
  const { data } = await supabase
    .from('perfis')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!data) return null
  // banco usa 'role', código usa 'papel' — normaliza aqui para não mudar todos os arquivos
  return { ...data, papel: (data as any).role ?? (data as any).papel }
}
