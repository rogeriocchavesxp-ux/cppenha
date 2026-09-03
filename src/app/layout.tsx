import type { Metadata } from 'next'
import { Cinzel, Montserrat } from 'next/font/google'
import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-display',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Colégio Presbiteriano da Penha',
  description: 'Sistema de Gestão Escolar — Educação Clássica Cristã',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${cinzel.variable} ${montserrat.variable}`}>
      <body>
        {children}
      </body>
    </html>
  )
}
