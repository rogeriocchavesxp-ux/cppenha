-- ============================================================
-- FASE 2: políticas RLS para professores e coordenadores
-- ============================================================

-- Professores podem ver as turmas às quais foram atribuídos
create policy "professor_turmas_atribuidas" on public.turmas
  for select using (
    public.papel_atual() = 'professor'
    and exists (
      select 1 from public.atribuicoes a
      where a.perfil_id = auth.uid() and a.turma_id = turmas.id
    )
  );

-- Todos os colaboradores podem listar disciplinas (leitura)
create policy "staff_leem_disciplinas" on public.disciplinas
  for select using (public.papel_atual() in ('admin', 'secretaria', 'coordenador', 'professor'));

-- Professores veem suas atribuições; staff vê todas
create policy "professor_suas_atribuicoes" on public.atribuicoes
  for select using (
    public.papel_atual() in ('admin', 'secretaria', 'coordenador')
    or (public.papel_atual() = 'professor' and perfil_id = auth.uid())
  );

-- Admin e coordenador gerenciam atribuições
create policy "admin_coordenador_gerencia_atribuicoes" on public.atribuicoes
  for all using (public.papel_atual() in ('admin', 'coordenador'));

-- Professores veem perfis de colegas (para exibir nomes nas atribuições)
create policy "staff_leem_perfis" on public.perfis
  for select using (public.papel_atual() in ('admin', 'secretaria', 'coordenador', 'professor'));

-- Professores veem matrículas das suas turmas
create policy "professor_matriculas_turmas" on public.matriculas
  for select using (
    public.papel_atual() = 'professor'
    and exists (
      select 1 from public.atribuicoes a
      where a.perfil_id = auth.uid() and a.turma_id = matriculas.turma_id
    )
  );

-- Professores veem dados dos alunos das suas turmas
create policy "professor_alunos_turmas" on public.alunos
  for select using (
    public.papel_atual() = 'professor'
    and exists (
      select 1 from public.matriculas m
      join public.atribuicoes a on a.turma_id = m.turma_id
      where a.perfil_id = auth.uid() and m.aluno_id = alunos.id
    )
  );
