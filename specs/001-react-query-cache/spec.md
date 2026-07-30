# Feature Specification: Cache de requisições com React Query

**Feature Branch**: `001-react-query-cache`

**Created**: 2026-07-30

**Status**: Draft

**Input**: User description: "Estou bem próximo de bater meu limite da api free do airtable quero melhorar minhas requisição, instalando o react query e mudando as chamadas já ajude pq colocamos um cache nas requisições. Não é um sistema com muitas atualizações somente semanalmente"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegar sem gastar cota desnecessária (Priority: P1)

Quem usa o SpotiCristo abre a home, vê a lista de álbuns, entra em um álbum e volta para a home (ou troca de álbum). Os dados que já foram carregados devem reaparecer de imediato, sem pedir de novo à fonte externa a cada visita ou remount da tela, enquanto o cache ainda for considerado válido.

**Why this priority**: O problema imediato é o limite da cota gratuita; o valor principal é reduzir chamadas repetidas no uso normal do app.

**Independent Test**: Abrir a home, abrir um álbum, voltar à home e abrir o mesmo álbum de novo; na segunda passagem os dados já conhecidos não disparam uma nova ida à fonte externa enquanto o cache estiver fresco.

**Acceptance Scenarios**:

1. **Given** a lista de álbuns ainda não foi carregada nesta sessão, **When** o usuário abre a home, **Then** a lista é buscada uma vez e exibida (com estado de carregamento enquanto espera).
2. **Given** a lista de álbuns já está em cache válido, **When** o usuário volta à home ou a tela remonta, **Then** a lista aparece sem nova requisição à fonte externa.
3. **Given** as músicas de um álbum já estão em cache válido, **When** o usuário reabre esse mesmo álbum, **Then** as músicas aparecem sem nova requisição à fonte externa.

---

### User Story 2 - Dados semanais sem pressionar atualização constante (Priority: P2)

O catálogo muda no máximo cerca de uma vez por semana. O usuário não precisa de dados “ao vivo” a cada clique; o app deve tratar o cache como fresco por um intervalo compatível com essa cadência semanal, evitando refetch automático agressivo.

**Why this priority**: Alinha o comportamento do cache ao ritmo real de mudança do conteúdo e maximiza a economia de cota sem prejudicar a experiência.

**Independent Test**: Após carregar álbuns e músicas, permanecer no app e navegar entre telas dentro do intervalo de frescor; nenhuma refetch automática por foco/remontagem deve ocorrer só por navegação.

**Acceptance Scenarios**:

1. **Given** dados em cache ainda dentro do intervalo de frescor semanal, **When** o usuário navega entre home e álbuns, **Then** o app reutiliza o cache e não dispara refetch só por navegação ou remount.
2. **Given** o intervalo de frescor do cache expirou, **When** o usuário solicita de novo aqueles dados (ex.: abrir a home ou o álbum), **Then** o app pode buscar dados atualizados na fonte externa.

---

### User Story 3 - Falha de rede com feedback previsível (Priority: P3)

Se a busca falhar (rede ou fonte indisponível), o usuário continua vendo um comportamento claro: erro registrado/tratado sem quebrar a navegação, e — quando houver cache anterior — preferir mostrar o que já foi obtido a deixar a tela vazia sem motivo.

**Why this priority**: Importante para robustez, mas secundário ao objetivo de economizar cota no fluxo feliz.

**Independent Test**: Simular falha na primeira carga e numa carga com cache prévio; confirmar loading/erro e reuso de dados em cache quando existirem.

**Acceptance Scenarios**:

1. **Given** não há cache e a fonte externa falha, **When** o usuário abre a home ou um álbum, **Then** o carregamento termina e o app não trava; a ausência de dados é tratada de forma previsível (lista vazia ou estado de erro já existente no produto).
2. **Given** existe cache válido de uma carga anterior e uma nova tentativa falha, **When** o usuário revisita a tela, **Then** os dados em cache continuam disponíveis para uso.

---

### Edge Cases

- O que acontece na primeira visita (cache frio) com rede lenta — loading deve continuar visível até concluir ou falhar.
- O que acontece ao abrir um álbum cujo id não existe ou não retorna músicas — lista vazia, sem loop de requisições.
- O que acontece ao alternar rapidamente entre vários álbuns — cada álbum usa sua própria chave de cache; não misturar músicas de álbuns diferentes.
- O que acontece após o frescor semanal expirar — a próxima necessidade de dados pode refetch; não é obrigatório refetch em background agressivo só por ter expirado.
- Token ou base indisponível — falha tratada como hoje (log/erro), sem novas tentativas em rajada que consumam cota.

## Requirements

### Functional Requirements

- **FR-001**: O app MUST obter a lista de álbuns e as músicas por álbum por meio de uma camada de cache de consultas no cliente, em vez de disparar fetch em todo mount sem reutilizar resultado.
- **FR-002**: O app MUST reutilizar dados já obtidos enquanto o cache estiver dentro do intervalo de frescor, evitando novas chamadas à fonte externa só por remontar a tela ou navegar de volta.
- **FR-003**: O intervalo de frescor do cache MUST ser compatível com atualizações semanais do catálogo (na ordem de dias, alinhado a “cerca de uma vez por semana”), não a segundos ou minutos.
- **FR-004**: Consultas de músicas MUST ser isoladas por álbum (chave distinta por álbum), para que o cache de um álbum não sirva dados de outro.
- **FR-005**: O app MUST preservar os estados de carregamento já usados na interface (skeletons / flags de loading) durante a primeira carga ou quando não houver dado em cache.
- **FR-006**: Controles de reprodução (música atual, play/pause, próximo/anterior) MUST continuar funcionando como hoje e NÃO devem depender de refetch contínuo à fonte externa.
- **FR-007**: O app SHOULD evitar refetch automático agressivo em foco de janela ou remontagem enquanto o cache estiver fresco.
- **FR-008**: Em falha de rede ou da fonte, o app MUST não entrar em loop de retentativas que consuma a cota de forma descontrolada.

### Key Entities

- **Álbum**: item do catálogo (identificador, nome, banner, cor, tags); listado na home e usado para abrir a página do álbum.
- **Música**: faixa de um álbum (identificador, nome, tom, arquivo de áudio, tags); carregada no contexto de um álbum específico.
- **Consulta em cache**: resultado de uma busca de álbuns ou de músicas de um álbum, identificado por chave, com intervalo de frescor e reuso entre navegações.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Em uma sessão típica (abrir home → abrir um álbum → voltar → reabrir o mesmo álbum) com cache ainda fresco, o número de idas à fonte externa para esses dados é no máximo uma por recurso (lista de álbuns uma vez; músicas daquele álbum uma vez), não uma por visita de tela.
- **SC-002**: Navegação de volta à home ou ao mesmo álbum com cache fresco exibe os dados em menos de 1 segundo na maior parte dos casos (reuso local, sem esperar a rede).
- **SC-003**: Dentro de um período de uso contínuo inferior ao intervalo de frescor semanal, recorridos à mesma home e aos mesmos álbuns não disparam novas chamadas só por remount/navegação.
- **SC-004**: Fluxo de reprodução (tocar, pausar, próximo, anterior) permanece utilizável sem regressão após a mudança.
- **SC-005**: 100% das telas que hoje buscam álbuns ou músicas passam a obter esses dados via a camada de cache de consultas (nenhuma tela dessas continua com fetch “sempre no mount” sem cache).

## Assumptions

- A biblioteca a instalar é a pedida pelo solicitante: React Query (TanStack Query).
- O catálogo no Airtable muda no máximo cerca de uma vez por semana; frescor na ordem de vários dias (ex.: ~7 dias) é adequado; não há requisito de invalidação manual nesta entrega.
- Não há necessidade nesta feature de mutações (criar/editar/apagar) na fonte — apenas leitura.
- Os providers/contexts atuais de álbum e música podem ser adaptados para usar a camada de cache, mantendo a API consumida pelos componentes sempre que possível.
- Reduzir chamadas no cliente é o objetivo desta entrega; proxy/server-side cache ou mudança de provedor de dados ficam fora de escopo.

## Verbatim Constraints

- `react query` (biblioteca pedida explicitamente para instalar e usar nas chamadas)
- Atualizações do catálogo: somente semanalmente (cadência que o cache deve respeitar)

## Approach

- Instalar `@tanstack/react-query` e envolver o app com um `QueryClientProvider` (frescor ~semanal, sem refetch agressivo em foco).
- Adaptar `src/contexts/AlbumContext.tsx` para `useQuery` na lista de álbuns.
- Adaptar `src/contexts/SongContext.tsx` para `useQuery` nas músicas por álbum (chave por `albumId`), mantendo estado de player local.
- Ajustar `src/app/layout.tsx` (e, se útil, um provider dedicado) para montar o client de queries.
- Reutilizar `src/service/records.ts` / `getTableRecords` como função de fetch das queries — sem mudar o contrato da API Airtable nesta entrega.
