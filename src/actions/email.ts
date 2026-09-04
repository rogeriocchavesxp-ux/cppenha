'use server'

import { sendEmail, emailLayout } from '@/lib/mailer'
import { createSupabaseServer } from '@/lib/supabase-server'

// Busca emails dos responsáveis de uma turma ou de todos os alunos ativos
async function emailsDestinatarios(destino: 'todos' | 'turma' | 'colaboradores', turmaId?: string): Promise<string[]> {
  const sb = await createSupabaseServer()

  if (destino === 'colaboradores') {
    const { data } = await sb
      .from('perfis')
      .select('id')
      .neq('papel', 'pai')
      .eq('ativo', true)
    // perfis não têm email diretamente — usa auth.users via service role
    if (!data) return []
    const { data: users } = await sb.auth.admin.listUsers()
    const ids = new Set(data.map(p => p.id))
    return (users?.users ?? []).filter(u => ids.has(u.id)).map(u => u.email).filter(Boolean) as string[]
  }

  // para 'todos' e 'turma': pais/responsáveis
  let q = sb
    .from('responsaveis')
    .select('perfil_id')

  if (destino === 'turma' && turmaId) {
    // responsáveis de alunos com matrícula ativa nesta turma
    const { data: mats } = await sb
      .from('matriculas')
      .select('aluno_id')
      .eq('turma_id', turmaId)
      .eq('status', 'ativa')
    const alunoIds = (mats ?? []).map(m => m.aluno_id)
    if (alunoIds.length === 0) return []
    q = q.in('aluno_id', alunoIds)
  }

  const { data: resps } = await q
  if (!resps || resps.length === 0) return []

  const perfilIds = [...new Set(resps.map(r => r.perfil_id).filter(Boolean))]
  const { data: users } = await sb.auth.admin.listUsers()
  const ids = new Set(perfilIds)
  return (users?.users ?? []).filter(u => ids.has(u.id)).map(u => u.email).filter(Boolean) as string[]
}

export async function enviarComunicadoPorEmail(comunicadoId: string) {
  const sb = await createSupabaseServer()

  const { data: c, error } = await sb
    .from('comunicados')
    .select('*, perfis ( nome ), turmas ( id, nome )')
    .eq('id', comunicadoId)
    .single()

  if (error || !c) throw new Error('Comunicado não encontrado.')

  const destinatarios = await emailsDestinatarios(c.destino, c.turmas?.id)
  if (destinatarios.length === 0) throw new Error('Nenhum destinatário encontrado.')

  const dataFormatada = new Date(c.publicado_em).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  const corpo = `
    <h2 style="margin:0 0 8px;font-size:20px;color:#0D2A4D;">${c.titulo}</h2>
    <p style="margin:0 0 20px;font-size:13px;color:#9CA3AF;">
      Publicado por ${c.perfis?.nome ?? 'Secretaria'} em ${dataFormatada}
      ${c.turmas ? ` · Turma: ${c.turmas.nome}` : ''}
    </p>
    <div style="font-size:15px;color:#374151;line-height:1.7;white-space:pre-wrap;">${c.conteudo}</div>
  `

  // envia em lotes para não ultrapassar limites SMTP
  const BATCH = 50
  for (let i = 0; i < destinatarios.length; i += BATCH) {
    const lote = destinatarios.slice(i, i + BATCH)
    await sendEmail({
      to:      process.env.SMTP_USER!, // from address
      subject: `[CPP] ${c.titulo}`,
      html:    emailLayout(corpo),
      // BCC para os destinatários (privacidade)
    })
    // envia individualmente para não expor emails entre si
    await Promise.all(
      lote.map(email =>
        sendEmail({ to: email, subject: `[CPP] ${c.titulo}`, html: emailLayout(corpo) })
      )
    )
  }

  return { enviados: destinatarios.length }
}

export async function enviarAvisoInadimplencia(mensalidadeId: string) {
  const sb = await createSupabaseServer()

  const { data: m, error } = await sb
    .from('mensalidades')
    .select('*, alunos ( id, nome_completo ), anos_letivos ( ano )')
    .eq('id', mensalidadeId)
    .single()

  if (error || !m) throw new Error('Mensalidade não encontrada.')
  if (m.status === 'pago') throw new Error('Esta mensalidade já está paga.')

  // busca responsável financeiro do aluno
  const { data: resps } = await sb
    .from('responsaveis')
    .select('perfil_id')
    .eq('aluno_id', (m as any).alunos?.id)
    .eq('financeiro', true)

  if (!resps || resps.length === 0) throw new Error('Responsável financeiro não cadastrado.')

  const { data: users } = await sb.auth.admin.listUsers()
  const ids = new Set(resps.map(r => r.perfil_id))
  const emails = (users?.users ?? []).filter(u => ids.has(u.id)).map(u => u.email).filter(Boolean) as string[]

  if (emails.length === 0) throw new Error('Email do responsável não encontrado.')

  const MES_LABEL = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

  const aluno     = (m as any).alunos?.nome_completo ?? 'seu filho(a)'
  const mes       = MES_LABEL[m.mes] ?? String(m.mes)
  const ano       = (m as any).anos_letivos?.ano ?? ''
  const valor     = m.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  const vencimento = new Date(m.vencimento + 'T12:00:00').toLocaleDateString('pt-BR')
  const appUrl    = process.env.NEXT_PUBLIC_APP_URL ?? ''

  const corpo = `
    <h2 style="margin:0 0 16px;font-size:20px;color:#991B1B;">Aviso de Mensalidade em Atraso</h2>
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
      Prezado(a) responsável,<br/><br/>
      Identificamos que a mensalidade de <strong>${mes}/${ano}</strong> referente ao aluno
      <strong>${aluno}</strong> encontra-se em aberto.
    </p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <tr style="background:#F9FAFB;">
        <td style="padding:10px 16px;font-size:13px;color:#6B7280;border:1px solid #E5E7EB;">Aluno</td>
        <td style="padding:10px 16px;font-size:14px;color:#111827;font-weight:600;border:1px solid #E5E7EB;">${aluno}</td>
      </tr>
      <tr>
        <td style="padding:10px 16px;font-size:13px;color:#6B7280;border:1px solid #E5E7EB;">Referência</td>
        <td style="padding:10px 16px;font-size:14px;color:#111827;border:1px solid #E5E7EB;">${mes}/${ano}</td>
      </tr>
      <tr style="background:#F9FAFB;">
        <td style="padding:10px 16px;font-size:13px;color:#6B7280;border:1px solid #E5E7EB;">Valor</td>
        <td style="padding:10px 16px;font-size:14px;color:#111827;font-weight:600;border:1px solid #E5E7EB;">${valor}</td>
      </tr>
      <tr>
        <td style="padding:10px 16px;font-size:13px;color:#6B7280;border:1px solid #E5E7EB;">Vencimento</td>
        <td style="padding:10px 16px;font-size:14px;color:#991B1B;font-weight:600;border:1px solid #E5E7EB;">${vencimento}</td>
      </tr>
    </table>
    <p style="margin:0 0 24px;font-size:14px;color:#374151;line-height:1.7;">
      Regularize sua situação pelo portal do responsável ou entre em contato com a secretaria.
    </p>
    ${appUrl ? `<a href="${appUrl}/pais/financeiro" style="display:inline-block;background:#0D2A4D;color:#FFFFFF;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:600;text-decoration:none;">Acessar Portal do Responsável</a>` : ''}
  `

  await Promise.all(
    emails.map(email =>
      sendEmail({
        to:      email,
        subject: `[CPP] Mensalidade em atraso — ${mes}/${ano}`,
        html:    emailLayout(corpo),
      })
    )
  )

  return { enviados: emails.length }
}
