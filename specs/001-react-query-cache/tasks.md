# Tasks: Cache de requisições com React Query

**Input**: Design documents from `/specs/001-react-query-cache/`

**Prerequisites**: plan.md (resumido), spec.md (obrigatório), constitution.md

**Tests**: Não solicitados na spec — nenhuma tarefa de teste automatizado.

**Organization**: Tasks agrupadas por user story para implementação e validação independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência de tasks incompletas)
- **[Story]**: User story (US1, US2, US3)
- Incluir caminhos de arquivo exatos nas descrições

## Path Conventions

- SpotiCristo: `src/app/`, `src/components/`, `src/contexts/`, `src/service/`, `src/@types/`
- Novo provider: `src/providers/` (ainda não existe)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Instalar a dependência pedida pela spec

- [x] T001 Instalar `@tanstack/react-query` e atualizar `package.json` / lockfile

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura de QueryClient que TODAS as user stories usam

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase

- [x] T002 Criar `QueryClient` com frescor ~semanal (`staleTime` na ordem de dias, ex. 7 dias), `refetchOnWindowFocus: false` e retentativas limitadas (evitar loop de cota) em `src/providers/QueryProvider.tsx`
- [x] T003 Envolver a árvore de providers existentes com `QueryProvider` em `src/app/layout.tsx` (acima de `AlbumProvider` / `SongProvider`)

**Checkpoint**: App sobe com `QueryClientProvider`; contexts ainda usam fetch antigo até as fases de story

---

## Phase 3: User Story 1 - Navegar sem gastar cota desnecessária (Priority: P1) 🎯 MVP

**Goal**: Lista de álbuns e músicas por álbum passam por `useQuery`, reaparecendo do cache ao voltar/remontar sem nova ida à fonte enquanto fresco.

**Independent Test**: Home → álbum → home → mesmo álbum; na 2ª passagem, com cache fresco, não dispara nova chamada à fonte para esses recursos (SC-001).

### Implementation for User Story 1

- [x] T004 [US1] Migrar carga de álbuns de `useEffect`+`useState` para `useQuery` (chave estável de álbuns, `queryFn` via `getTableRecords` + mesma transformação `isAlbumFields`) em `src/contexts/AlbumContext.tsx`, preservando `albums` e `isLoadingAlbums` na API do context
- [x] T005 [US1] Migrar carga de músicas para `useQuery` com chave isolada por `albumId` (FR-004), acionada por `getSongs(albumId)`, reutilizando `getTableRecords` + `isSongFields` em `src/contexts/SongContext.tsx`, preservando estado local do player (`currentSong`, `isPlaying`, `playNext`, `playPrevious`)
- [x] T006 [US1] Confirmar que consumidores (`src/app/page.tsx`, `src/app/[albumId]/page.tsx`, `src/components/Sidebar.tsx`) continuam usando `useAlbum` / `useSong` sem mudança de contrato desnecessária

**Checkpoint**: US1 funcional — navegação reutiliza cache; player continua utilizável

---

## Phase 4: User Story 2 - Dados semanais sem pressionar atualização constante (Priority: P2)

**Goal**: Cache tratado como fresco por intervalo compatível com cadência semanal; sem refetch automático agressivo só por navegação/foco.

**Independent Test**: Após carregar álbuns/músicas, navegar home ↔ álbuns dentro do frescor; nenhuma refetch automática só por remount/foco (SC-003).

### Implementation for User Story 2

- [x] T007 [US2] Revisar e alinhar defaults do client em `src/providers/QueryProvider.tsx` a FR-003/FR-007 (`staleTime` ~semanal, `refetchOnWindowFocus: false`, evitar `refetchOnMount` agressivo enquanto fresco)
- [x] T008 [P] [US2] Garantir opções de query de álbuns alinhadas ao frescor semanal em `src/contexts/AlbumContext.tsx` (sem override que force refetch a cada mount)
- [x] T009 [P] [US2] Garantir opções de query de músicas alinhadas ao frescor semanal e chave por álbum em `src/contexts/SongContext.tsx`

**Checkpoint**: US1 + US2 — reuso de cache e política semanal consistentes

---

## Phase 5: User Story 3 - Falha de rede com feedback previsível (Priority: P3)

**Goal**: Falha não trava navegação; sem loop de retries que consuma cota; com cache prévio, preferir dados já obtidos.

**Independent Test**: Simular falha sem cache (erro/lista vazia previsível) e com cache prévio (dados em cache seguem disponíveis) — FR-008 / cenários US3.

### Implementation for User Story 3

- [x] T010 [US3] Em `src/providers/QueryProvider.tsx`, limitar/desligar retries agressivos no default do `QueryClient` (FR-008)
- [x] T011 [P] [US3] Em falha sem cache, manter tratamento previsível (log + lista vazia / loading false) em `src/contexts/AlbumContext.tsx`, sem quebrar a UI
- [x] T012 [P] [US3] Em falha com cache prévio, expor dados em cache (ex. `placeholderData` / dados anteriores da query) e loading/erro previsíveis em `src/contexts/SongContext.tsx` e, se aplicável, `src/contexts/AlbumContext.tsx`

**Checkpoint**: Todas as stories independentemente utilizáveis; falhas não disparam rajadas de cota

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validação transversal e integridade de playback (Constitution III)

- [x] T013 Validar fluxo de reprodução (tocar, pausar, próximo, anterior) sem regressão após as migrações (SC-004) via `src/contexts/SongContext.tsx` e UI existente
- [x] T014 [P] Confirmar que nenhuma tela que busca álbuns/músicas permanece com fetch “sempre no mount” sem cache (SC-005): `src/contexts/AlbumContext.tsx`, `src/contexts/SongContext.tsx`
- [x] T015 Remover código morto do fetch antigo (`useEffect`/`setState` de loading só para fetch) nos contexts migrados, se ainda restar

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências
- **Foundational (Phase 2)**: Depende de Setup — **bloqueia** todas as stories
- **User Story 1 (Phase 3)**: Depende de Foundational — MVP
- **User Story 2 (Phase 4)**: Depende de Foundational; na prática após US1 (ajuste fino das mesmas queries)
- **User Story 3 (Phase 5)**: Depende de Foundational; ideal após US1 (precisa de queries existentes para “cache prévio”)
- **Polish (Phase 6)**: Depende das stories desejadas

### User Story Dependencies

- **US1 (P1)**: Após Phase 2 — independente de US2/US3
- **US2 (P2)**: Após Phase 2; melhora política de frescor das queries da US1
- **US3 (P3)**: Após Phase 2; reforça erro/retry sobre as queries da US1

### Within Each User Story

- Contexts/API do context antes de validar consumidores
- Player local permanece fora do ciclo de refetch
- Story completa e testável antes da próxima prioridade (se sequencial)

### Parallel Opportunities

- Após T003: T008 e T009 em paralelo (US2)
- Após defaults de retry (T010): T011 e T012 em paralelo (US3)
- T014 pode rodar em paralelo com T013 na fase de polish

---

## Parallel Example: User Story 2

```bash
# Após T007 (defaults do client), em paralelo:
Task: "Garantir opções de query de álbuns alinhadas ao frescor semanal em src/contexts/AlbumContext.tsx"
Task: "Garantir opções de query de músicas alinhadas ao frescor semanal em src/contexts/SongContext.tsx"
```

## Parallel Example: User Story 3

```bash
# Após T010, em paralelo:
Task: "Tratamento previsível de falha sem cache em src/contexts/AlbumContext.tsx"
Task: "Expor cache prévio em falha em src/contexts/SongContext.tsx (e Album se aplicável)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1: Setup (T001)
2. Completar Phase 2: Foundational (T002–T003)
3. Completar Phase 3: US1 (T004–T006)
4. **STOP and VALIDATE**: Home → álbum → home → mesmo álbum com cache fresco
5. Demo se pronto

### Incremental Delivery

1. Setup + Foundational → provider pronto
2. US1 → cache na navegação (MVP / economia de cota)
3. US2 → política semanal explícita
4. US3 → falhas previsíveis sem gastar cota
5. Polish → playback + cobertura SC-005

### Parallel Team Strategy

1. Time fecha Setup + Foundational juntos
2. Depois: US1 primeiro (MVP); US2/US3 podem seguir no mesmo par de files com coordenação (mesmo `AlbumContext` / `SongContext`)

---

## Notes

- [P] = arquivos diferentes / sem dependência de task incompleta
- Sem mutações Airtable nesta entrega — só leitura
- Reutilizar `src/service/records.ts` (`getTableRecords`) como `queryFn` — sem mudar contrato da API
- Commit após cada task ou grupo lógico
- Parar em qualquer checkpoint para validar a story isoladamente
