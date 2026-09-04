import type { ReactNode } from 'react'
import { SiteNav } from '@/components/site/SiteNav'
import { SiteFooter } from '@/components/site/SiteFooter'

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: '#FFFFFF', color: '#1F2937', minHeight: '100vh' }}>
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
