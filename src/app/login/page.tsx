'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Image from 'next/image'
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

      <Button type="submit" loading={loading} className="w-full mt-1">
        Entrar
      </Button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--background)' }}>
      {/* Painel esquerdo — identidade CPP */}
      <div
        className="hidden lg:flex flex-col justify-between w-96 shrink-0 p-12"
        style={{ background: 'var(--navy-900)' }}
      >
        <div className="flex flex-col items-start gap-8">
          {/* Logo completo em card branco */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: '#fff',
              padding: '20px 24px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.30)',
            }}
          >
            <Image
              src="/logo-completo.jpeg"
              alt="Colégio Presbiteriano da Penha"
              width={260}
              height={136}
              style={{ objectFit: 'contain', display: 'block' }}
              priority
            />
          </div>
        </div>
        <p
          className="text-sm leading-relaxed italic"
          style={{ color: 'rgba(255,255,255,0.40)', fontFamily: 'var(--font-sans)' }}
        >
          "O temor do Senhor é o princípio da sabedoria."<br />
          <span className="not-italic text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Provérbios 9.10
          </span>
        </p>
      </div>

      {/* Formulário */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-soft)' }}>
              <Image
                src="/logo-escudo.jpeg"
                alt="CPP"
                width={40}
                height={40}
                style={{ objectFit: 'contain', display: 'block' }}
              />
            </div>
            <div>
              <p className="font-display text-sm font-semibold" style={{ color: 'var(--navy-900)' }}>
                Colégio Presbiteriano da Penha
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Sistema de Gestão</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            Entrar
          </h2>
          <p className="text-sm mb-7" style={{ color: 'var(--text-secondary)' }}>
            Use o e-mail e senha cadastrados pela secretaria.
          </p>

          <Suspense fallback={<div className="h-40" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
