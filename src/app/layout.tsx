import type { Metadata } from 'next'
import { Cinzel, EB_Garamond } from 'next/font/google'
import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
})

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Colégio Presbiteriano da Penha',
  description: 'Sistema de Gestão Escolar — Educação Clássica Cristã',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${cinzel.variable} ${ebGaramond.variable}`}>
      <body>
        {children}
      </body>
    </html>
  )
}
