'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Papel } from '@/types'

const PAPEL_HOME: Record<Papel, string> = {
  admin:       '/admin',
  secretaria:  '/secretaria',
  coordenador: '/coordenacao',
  professor:   '/professor',
  pai:         '/pais',
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const erro = searchParams.get('erro')

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erroForm, setErroForm] = useState<string | null>(
    erro === 'acesso_negado' ? 'Acesso negado ou conta inativa.' : null
  )

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErroForm(null)
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha })

    if (error || !data.session) {
      setErroForm('E-mail ou senha incorretos.')
      setLoading(false)
      return
    }

    const { data: perfil, error: perfilError } = await supabase
      .from('perfis')
      .select('papel')
      .eq('id', data.session.user.id)
      .single()

    const papel = (perfil as any)?.papel as Papel | undefined

    if (!papel) {
      await supabase.auth.signOut()
      setErroForm('Usuário sem perfil de acesso. Contacte a secretaria.')
      setLoading(false)
      return
    }

    const destino = redirect || PAPEL_HOME[papel]
    router.push(destino)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="E-mail"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="seu@email.com"
        required
        autoComplete="email"
      />
      <Input
        label="Senha"
        type="password"
        value={senha}
        onChange={e => setSenha(e.target.value)}
        placeholder="••••••••"
        required
        autoComplete="current-password"
      />

      {erroForm && (
        <p
          className="text-xs px-3 py-2 rounded-md"
          style={{ background: 'var(--red-100)', color: 'var(--red-600)' }}
        >
          {erroForm}
        </p>
      )}

      <Button type="submit" size="lg" loading={loading} className="w-full mt-2" style={{ letterSpacing: '0.07em' }}>
        Entrar
      </Button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-sm px-6">
        <Suspense fallback={<div className="h-40" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
