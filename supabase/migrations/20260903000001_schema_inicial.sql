-- ============================================================
-- SCHEMA INICIAL — Colégio Presbiteriano da Penha
-- ============================================================

-- Extensões


-- ============================================================
-- PERFIS DE USUÁRIO (vinculados ao auth.users do Supabase)
-- ============================================================
create type public.papel_usuario as enum ('admin', 'secretaria', 'coordenador', 'professor', 'pai');

create table public.perfis (
  id          uuid primary key references auth.users(id) on delete cascade,
  nome        text not null,
  telefone    text,
  papel       public.papel_usuario not null default 'pai',
  ativo       boolean not null default true,
  criado_em   timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- ============================================================
-- ANOS LETIVOS
-- ============================================================
create table public.anos_letivos (
  id          uuid primary key default gen_random_uuid(),
  ano         int not null unique,
  ativo       boolean not null default false,
  inicio      date not null,
  termino     date not null,
  criado_em   timestamptz not null default now()
);

-- ============================================================
-- TURMAS
-- ============================================================
create type public.nivel_ensino as enum ('infantil', 'fundamental_1', 'fundamental_2', 'medio');

create table public.turmas (
  id              uuid primary key default gen_random_uuid(),
  ano_letivo_id   uuid not null references public.anos_letivos(id),
  nome            text not null,        -- ex: "5º Ano A"
  serie           text not null,        -- ex: "5º Ano"
  nivel           public.nivel_ensino not null,
  turno           text not null check (turno in ('manha', 'tarde', 'integral')),
  capacidade      int not null default 30,
  criado_em       timestamptz not null default now()
);

-- ============================================================
-- ALUNOS
-- ============================================================
create table public.alunos (
  id              uuid primary key default gen_random_uuid(),
  nome_completo   text not null,
  data_nascimento date not null,
  cpf             text unique,
  foto_url        text,
  matricula       text unique,
  ativo           boolean not null default true,
  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now()
);

-- ============================================================
-- RESPONSÁVEIS (pais) → alunos
-- ============================================================
create table public.responsaveis (
  id              uuid primary key default gen_random_uuid(),
  perfil_id       uuid references public.perfis(id) on delete set null,
  aluno_id        uuid not null references public.alunos(id) on delete cascade,
  parentesco      text not null,   -- ex: "pai", "mãe", "avó"
  financeiro      boolean not null default false,  -- responsável financeiro
  criado_em       timestamptz not null default now()
);

-- ============================================================
-- MATRÍCULAS (aluno × turma × ano letivo)
-- ============================================================
create type public.status_matricula as enum ('ativa', 'trancada', 'cancelada', 'concluida', 'transferida');

create table public.matriculas (
  id              uuid primary key default gen_random_uuid(),
  aluno_id        uuid not null references public.alunos(id),
  turma_id        uuid not null references public.turmas(id),
  ano_letivo_id   uuid not null references public.anos_letivos(id),
  status          public.status_matricula not null default 'ativa',
  data_matricula  date not null default current_date,
  criado_em       timestamptz not null default now(),
  unique (aluno_id, ano_letivo_id)
);

-- ============================================================
-- DISCIPLINAS
-- ============================================================
create table public.disciplinas (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  codigo      text unique,
  descricao   text,
  criado_em   timestamptz not null default now()
);

-- ============================================================
-- PROFESSORES → TURMAS → DISCIPLINAS
-- ============================================================
create table public.atribuicoes (
  id              uuid primary key default gen_random_uuid(),
  perfil_id       uuid not null references public.perfis(id),
  turma_id        uuid not null references public.turmas(id),
  disciplina_id   uuid not null references public.disciplinas(id),
  ano_letivo_id   uuid not null references public.anos_letivos(id),
  criado_em       timestamptz not null default now(),
  unique (perfil_id, turma_id, disciplina_id, ano_letivo_id)
);

-- ============================================================
-- NOTAS
-- ============================================================
create table public.notas (
  id              uuid primary key default gen_random_uuid(),
  matricula_id    uuid not null references public.matriculas(id) on delete cascade,
  disciplina_id   uuid not null references public.disciplinas(id),
  bimestre        int not null check (bimestre between 1 and 4),
  nota            numeric(4,2) check (nota between 0 and 10),
  recuperacao     numeric(4,2) check (recuperacao between 0 and 10),
  observacao      text,
  lancado_por     uuid references public.perfis(id),
  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now(),
  unique (matricula_id, disciplina_id, bimestre)
);

-- ============================================================
-- FREQUÊNCIA
-- ============================================================
create table public.frequencias (
  id              uuid primary key default gen_random_uuid(),
  matricula_id    uuid not null references public.matriculas(id) on delete cascade,
  disciplina_id   uuid not null references public.disciplinas(id),
  data            date not null,
  presente        boolean not null default true,
  justificada     boolean not null default false,
  observacao      text,
  lancado_por     uuid references public.perfis(id),
  criado_em       timestamptz not null default now(),
  unique (matricula_id, disciplina_id, data)
);

-- ============================================================
-- MENSALIDADES
-- ============================================================
create type public.status_mensalidade as enum ('pendente', 'pago', 'atrasado', 'isento', 'cancelado');

create table public.mensalidades (
  id              uuid primary key default gen_random_uuid(),
  aluno_id        uuid not null references public.alunos(id),
  ano_letivo_id   uuid not null references public.anos_letivos(id),
  mes             int not null check (mes between 1 and 12),
  valor           numeric(10,2) not null,
  vencimento      date not null,
  status          public.status_mensalidade not null default 'pendente',
  pago_em         date,
  valor_pago      numeric(10,2),
  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now(),
  unique (aluno_id, ano_letivo_id, mes)
);

-- ============================================================
-- COMUNICADOS
-- ============================================================
create type public.destino_comunicado as enum ('todos', 'turma', 'aluno', 'colaboradores');

create table public.comunicados (
  id              uuid primary key default gen_random_uuid(),
  titulo          text not null,
  conteudo        text not null,
  destino         public.destino_comunicado not null default 'todos',
  turma_id        uuid references public.turmas(id),
  aluno_id        uuid references public.alunos(id),
  publicado_por   uuid references public.perfis(id),
  publicado_em    timestamptz not null default now(),
  criado_em       timestamptz not null default now()
);

-- ============================================================
-- CALENDÁRIO / EVENTOS
-- ============================================================
create table public.eventos (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  descricao   text,
  inicio      timestamptz not null,
  termino     timestamptz,
  dia_todo    boolean not null default false,
  tipo        text not null default 'geral',   -- 'feriado', 'prova', 'reuniao', 'culto', 'geral'
  turma_id    uuid references public.turmas(id),
  criado_por  uuid references public.perfis(id),
  criado_em   timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.perfis         enable row level security;
alter table public.alunos         enable row level security;
alter table public.responsaveis   enable row level security;
alter table public.matriculas     enable row level security;
alter table public.notas          enable row level security;
alter table public.frequencias    enable row level security;
alter table public.mensalidades   enable row level security;
alter table public.comunicados    enable row level security;
alter table public.eventos        enable row level security;
alter table public.turmas         enable row level security;
alter table public.disciplinas    enable row level security;
alter table public.atribuicoes    enable row level security;
alter table public.anos_letivos   enable row level security;

-- Função auxiliar para checar papel do usuário autenticado
create or replace function public.papel_atual()
returns public.papel_usuario
language sql stable security definer
as $$
  select papel from public.perfis where id = auth.uid()
$$;

-- Políticas básicas: admin e secretaria veem tudo
create policy "admin_secretaria_tudo" on public.alunos
  for all using (public.papel_atual() in ('admin', 'secretaria'));

create policy "admin_secretaria_tudo" on public.matriculas
  for all using (public.papel_atual() in ('admin', 'secretaria'));

create policy "admin_secretaria_tudo" on public.mensalidades
  for all using (public.papel_atual() in ('admin', 'secretaria'));

create policy "admin_secretaria_tudo" on public.turmas
  for all using (public.papel_atual() in ('admin', 'secretaria', 'coordenador'));

create policy "admin_secretaria_tudo" on public.disciplinas
  for all using (public.papel_atual() in ('admin', 'secretaria', 'coordenador'));

create policy "admin_secretaria_tudo" on public.anos_letivos
  for all using (public.papel_atual() in ('admin', 'secretaria'));

-- Professores: veem e lançam notas/frequências das suas turmas
create policy "professor_suas_turmas" on public.notas
  for all using (
    public.papel_atual() in ('admin', 'secretaria', 'coordenador')
    or exists (
      select 1 from public.atribuicoes a
      join public.matriculas m on m.turma_id = a.turma_id
      where a.perfil_id = auth.uid()
        and m.id = notas.matricula_id
        and a.disciplina_id = notas.disciplina_id
    )
  );

create policy "professor_suas_turmas" on public.frequencias
  for all using (
    public.papel_atual() in ('admin', 'secretaria', 'coordenador')
    or exists (
      select 1 from public.atribuicoes a
      join public.matriculas m on m.turma_id = a.turma_id
      where a.perfil_id = auth.uid()
        and m.id = frequencias.matricula_id
        and a.disciplina_id = frequencias.disciplina_id
    )
  );

-- Pais: veem dados dos seus filhos
create policy "pai_seus_filhos_alunos" on public.alunos
  for select using (
    public.papel_atual() = 'pai'
    and exists (
      select 1 from public.responsaveis r
      where r.perfil_id = auth.uid() and r.aluno_id = alunos.id
    )
  );

create policy "pai_seus_filhos_notas" on public.notas
  for select using (
    public.papel_atual() = 'pai'
    and exists (
      select 1 from public.responsaveis r
      join public.matriculas m on m.aluno_id = r.aluno_id
      where r.perfil_id = auth.uid() and m.id = notas.matricula_id
    )
  );

create policy "pai_seus_filhos_frequencias" on public.frequencias
  for select using (
    public.papel_atual() = 'pai'
    and exists (
      select 1 from public.responsaveis r
      join public.matriculas m on m.aluno_id = r.aluno_id
      where r.perfil_id = auth.uid() and m.id = frequencias.matricula_id
    )
  );

create policy "pai_seus_filhos_mensalidades" on public.mensalidades
  for select using (
    public.papel_atual() = 'pai'
    and exists (
      select 1 from public.responsaveis r
      where r.perfil_id = auth.uid() and r.aluno_id = mensalidades.aluno_id
    )
  );

-- Comunicados e eventos: todos autenticados podem ver
create policy "autenticados_leem" on public.comunicados
  for select using (auth.uid() is not null);

create policy "autenticados_leem" on public.eventos
  for select using (auth.uid() is not null);

create policy "staff_gerencia_comunicados" on public.comunicados
  for all using (public.papel_atual() in ('admin', 'secretaria', 'coordenador', 'professor'));

create policy "staff_gerencia_eventos" on public.eventos
  for all using (public.papel_atual() in ('admin', 'secretaria', 'coordenador'));

-- Perfis: cada usuário vê o próprio; admin vê todos
create policy "perfil_proprio" on public.perfis
  for select using (id = auth.uid() or public.papel_atual() = 'admin');

create policy "admin_gerencia_perfis" on public.perfis
  for all using (public.papel_atual() = 'admin');
