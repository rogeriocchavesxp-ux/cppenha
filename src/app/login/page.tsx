'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
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

    const { data: perfil } = await supabase
      .from('perfis')
      .select('role')
      .eq('id', data.session.user.id)
      .single()

    const papel = (perfil as any)?.role as Papel | undefined
    const destino = redirect || (papel ? PAPEL_HOME[papel] : '/login')

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
        className="hidden lg:flex flex-col justify-between w-80 shrink-0 p-10"
        style={{ background: 'var(--navy-900)' }}
      >
        <div>
          <p className="font-display text-5xl font-semibold text-white leading-none tracking-tight">
            CPP
          </p>
          <div className="w-8 my-4" style={{ height: '1px', background: 'rgba(255,255,255,0.25)' }} />
          <p className="text-white text-sm font-medium leading-snug">
            Colégio Presbiteriano<br />da Penha
          </p>
          <p className="text-xs mt-1 tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Educação Clássica Cristã
          </p>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
          "O temor do Senhor é o princípio da sabedoria."<br />
          Provérbios 9.10
        </p>
      </div>

      {/* Formulário */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <span className="font-display text-3xl font-semibold" style={{ color: 'var(--navy-900)' }}>
              CPP
            </span>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
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
