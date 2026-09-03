export type Papel = 'admin' | 'secretaria' | 'coordenador' | 'professor' | 'pai'

export type Perfil = {
  id: string
  nome: string
  telefone: string | null
  papel: Papel
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

export type NivelEnsino = 'infantil' | 'fundamental_1' | 'fundamental_2' | 'medio'
export type Turno = 'manha' | 'tarde' | 'integral'

export type AnoLetivo = {
  id: string
  ano: number
  ativo: boolean
  inicio: string
  termino: string
}

export type Turma = {
  id: string
  ano_letivo_id: string
  nome: string
  serie: string
  nivel: NivelEnsino
  turno: Turno
  capacidade: number
}

export type Aluno = {
  id: string
  nome_completo: string
  data_nascimento: string
  cpf: string | null
  foto_url: string | null
  matricula: string | null
  ativo: boolean
}

export type StatusMatricula = 'ativa' | 'trancada' | 'cancelada' | 'concluida' | 'transferida'

export type Matricula = {
  id: string
  aluno_id: string
  turma_id: string
  ano_letivo_id: string
  status: StatusMatricula
  data_matricula: string
}

export type StatusMensalidade = 'pendente' | 'pago' | 'atrasado' | 'isento' | 'cancelado'

export type Mensalidade = {
  id: string
  aluno_id: string
  ano_letivo_id: string
  mes: number
  valor: number
  vencimento: string
  status: StatusMensalidade
  pago_em: string | null
  valor_pago: number | null
}

export type Disciplina = {
  id: string
  nome: string
  codigo: string | null
  descricao: string | null
}

export type Atribuicao = {
  id: string
  perfil_id: string
  turma_id: string
  disciplina_id: string
  ano_letivo_id: string
}

export type Nota = {
  id: string
  matricula_id: string
  disciplina_id: string
  bimestre: 1 | 2 | 3 | 4
  nota: number | null
  recuperacao: number | null
  observacao: string | null
  lancado_por: string | null
}

export type Frequencia = {
  id: string
  matricula_id: string
  disciplina_id: string
  data: string
  presente: boolean
  justificada: boolean
  observacao: string | null
}

export type NavItem = {
  label: string
  href: string
  icon?: string
  roles: Papel[]
}
