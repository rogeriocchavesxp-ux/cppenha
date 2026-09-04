import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Metodologia Clássica Cristã — Colégio Presbiteriano da Penha',
  description: 'Conheça o Trivium — Gramática, Dialética e Retórica — e como a educação clássica cristã forma pensadores íntegros e articulados.',
}

const ETAPAS = [
  {
    nome: 'Estágio da Gramática',
    idades: 'Anos Iniciais (6–10 anos)',
    cor: '#1E6B3C',
    descricao:
      'Na fase da Gramática, a criança tem sede natural de absorver fatos e informações. Aqui ela aprende a ler, escrever, contar e memorizar com prazer — dominando os alicerces do conhecimento em todas as disciplinas.',
    exemplos: ['Leitura e escrita estruturada', 'Memorização de poemas e salmos', 'Matemática fundamental', 'História narrativa e cronológica'],
  },
  {
    nome: 'Estágio da Dialética',
    idades: 'Anos Finais do Fundamental (11–14 anos)',
    cor: '#1A4070',
    descricao:
      'No estágio da Dialética, o aluno aprende a questionar, debater e conectar as informações absorvidas. Desenvolvemos o raciocínio lógico, a capacidade de argumentar e a disposição para descobrir a verdade.',
    exemplos: ['Lógica formal e informal', 'Debates estruturados', 'Análise de textos filosóficos e históricos', 'Introdução ao método científico'],
  },
  {
    nome: 'Estágio da Retórica',
    idades: 'Ensino Médio (15–18 anos)',
    cor: '#7A3000',
    descricao:
      'No ápice do Trivium, o aluno aprende a expressar suas ideias com clareza, persuasão e beleza. Ele domina a arte de escrever e falar para convencer e inspirar, apresentando com excelência tudo o que aprendeu.',
    exemplos: ['Redação argumentativa avançada', 'Oratória e apresentações públicas', 'Análise e produção literária', 'Defesa de trabalhos de conclusão'],
  },
]

const PILARES = [
  { titulo: 'Fé Reformada', texto: 'Todo o currículo está integrado à cosmovisão bíblica reformada. Não existe separação entre a fé e o aprendizado.' },
  { titulo: 'Grandes Obras', texto: 'Nossos alunos leem os grandes clássicos da literatura, filosofia e história, formando uma base cultural sólida e ampla.' },
  { titulo: 'Caráter em Primeiro', texto: 'Antes de qualquer disciplina, formamos o caráter. Virtude, diligência e humildade são cultivadas em todos os espaços.' },
  { titulo: 'Comunidade Familiar', texto: 'Escola, família e igreja caminham juntas. Pais são parceiros ativos na formação dos filhos, não apenas clientes.' },
]

export default function MetodologiaPage() {
  return (
    <div style={{ background: '#FFFFFF', color: '#1F2937' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, #0D2A4D 0%, #1A4070 100%)', padding: '80px 24px 72px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ margin: '0 0 16px', fontSize: '12px', fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
            Nossa Abordagem
          </p>
          <h1 style={{ margin: '0 0 20px', fontFamily: "'Cinzel',Georgia,serif", fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, textWrap: 'balance' }}>
            Metodologia Clássica Cristã
          </h1>
          <p style={{ margin: 0, fontSize: '18px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, maxWidth: '600px', marginInline: 'auto' }}>
            Uma educação enraizada na tradição ocidental cristã, estruturada pelo Trivium e orientada pelo temor do Senhor.
          </p>
        </div>
      </section>

      {/* O que é o Trivium */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', color: '#2E6BAD' }}>O que é o Trivium</p>
          <h2 style={{ margin: '0 0 24px', fontFamily: "'Cinzel',Georgia,serif", fontSize: 'clamp(22px,3vw,34px)', color: '#0D2A4D', lineHeight: 1.2 }}>
            Três estágios, uma formação completa
          </h2>
          <p style={{ margin: '0 0 16px', fontSize: '16px', lineHeight: 1.85, color: '#4B5563' }}>
            O Trivium é o coração da educação clássica. Diferente da pedagogia moderna que fragmenta o conhecimento por disciplinas, o Trivium entende que aprender é uma jornada em três estágios naturais, alinhados ao desenvolvimento humano.
          </p>
          <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.85, color: '#4B5563' }}>
            Cada estágio respeita a fase em que o aluno está, potencializando sua capacidade natural de aprender. O resultado é um jovem que não apenas conhece fatos, mas sabe pensar, questionar e comunicar com excelência.
          </p>
        </div>
      </section>

      {/* Etapas */}
      <section style={{ background: '#F9FAFB', padding: '0 24px 80px', borderTop: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '64px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {ETAPAS.map((etapa, i) => (
            <div
              key={etapa.nome}
              style={{ background: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E5E7EB', display: 'grid', gridTemplateColumns: '4px 1fr', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            >
              <div style={{ background: etapa.cor }} />
              <div style={{ padding: '36px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'baseline', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontFamily: "'Cinzel',Georgia,serif", fontSize: '20px', color: '#0D2A4D' }}>{etapa.nome}</h3>
                  <span style={{ fontSize: '12px', color: '#9CA3AF', fontStyle: 'italic' }}>{etapa.idades}</span>
                </div>
                <p style={{ margin: '0 0 20px', fontSize: '15px', lineHeight: 1.8, color: '#4B5563' }}>{etapa.descricao}</p>
                <ul style={{ margin: 0, padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {etapa.exemplos.map(e => (
                    <li key={e} style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.5 }}>{e}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pilares */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', color: '#2E6BAD' }}>Além do Trivium</p>
            <h2 style={{ margin: 0, fontFamily: "'Cinzel',Georgia,serif", fontSize: 'clamp(22px,3vw,34px)', color: '#0D2A4D' }}>
              Pilares que sustentam tudo
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '24px' }}>
            {PILARES.map(p => (
              <div key={p.titulo} style={{ padding: '28px', borderRadius: '12px', background: '#F0F6FF', border: '1px solid #D6E5F3' }}>
                <h3 style={{ margin: '0 0 12px', fontFamily: "'Cinzel',Georgia,serif", fontSize: '16px', color: '#0D2A4D' }}>{p.titulo}</h3>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.75, color: '#4B5563' }}>{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0D2A4D', padding: '72px 24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 16px', fontFamily: "'Cinzel',Georgia,serif", fontSize: 'clamp(20px,3vw,30px)', color: '#fff' }}>
            Quer conhecer mais?
          </h2>
          <p style={{ margin: '0 0 32px', fontSize: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
            Faça a pré-matrícula e entre em contato com nossa equipe para saber como essa formação pode transformar a vida do seu filho.
          </p>
          <Link
            href="/matricula"
            style={{ display: 'inline-block', padding: '14px 36px', borderRadius: '8px', background: '#FFFFFF', color: '#0D2A4D', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}
          >
            Fazer pré-matrícula
          </Link>
        </div>
      </section>
    </div>
  )
}
