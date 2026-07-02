# Jogo da Velha com Prolog (Tau Prolog)

Projeto acadêmico que integra interface web com lógica em Prolog executada no navegador via Tau Prolog.

## Visão geral

O projeto combina:

- Interface HTML/CSS com tabuleiro 3x3 clicável.
- JavaScript para carregar a base Prolog, enviar consultas e sincronizar o tabuleiro.
- Base Prolog dinâmica para armazenar estado das casas e turno atual.

Não há backend: toda a execução acontece no browser.

## Como funciona hoje

Ao abrir a página:

1. O JavaScript carrega `base-conhecimento.pl` via `fetch`.
2. A base é consultada na sessão Tau Prolog.
3. A consulta `inicializar.` é executada automaticamente.
4. O tabuleiro visual é sincronizado com os fatos Prolog (`conteudo/2`).

Durante o uso:

- Clique em uma célula para executar `jogar(Pos)`.
- Use o campo de texto para enviar consultas Prolog livres.
- Use `;` para obter a próxima resposta da consulta anterior.

Se uma consulta alterar a base (por exemplo: `jogar/1`, `inicializar/0`, `trocar_vez/0`, `assertz/1`, `retract/1`, `retractall/1`, `abolish/1`), a interface sincroniza o tabuleiro novamente.

## Predicados disponíveis na base (`base-conhecimento.pl`)

- `inicializar/0`: limpa o estado e cria 9 casas vazias (`v`), com vez de `x`.
- `proximo/2`: define alternância entre jogadores (`x` e `o`).
- `jogar/1`: joga na posição informada se estiver vazia e troca a vez.
- `trocar_vez/0`: alterna o jogador atual.
- `conteudo/2`: retorna o valor de uma posição (`x`, `o` ou `v`).
- `tabuleiro/1`: retorna lista com os valores das casas.
- `linha/3`: combinações vencedoras.
- `venceu/1`: verdadeiro quando um jogador preenche uma linha vencedora.

Predicados dinâmicos usados como estado:

- `casa/2`
- `vez/1`

## Estrutura do projeto

- `index.html`: interface e importação das libs Tau Prolog.
- `styles.css`: estilos da página.
- `script.js`: integração com Tau Prolog e lógica da interface.
- `base-conhecimento.pl`: base de conhecimento Prolog.

## Tecnologias

- HTML5
- CSS3
- JavaScript (vanilla)
- Prolog
- Tau Prolog (CDN)

## Requisitos

- Node.js (para subir servidor local com `npx serve`)

Verifique:

```bash
node -v
npm -v
npx -v
```

## Como executar

1. Clone o repositório:

  ```bash
  git clone <URL_DO_REPOSITORIO>
  cd prolog-jogo-velha
  ```

2. Suba um servidor HTTP local:

  ```bash
  npx serve
  ```

3. Abra a URL informada no terminal (normalmente `http://localhost:3000`).

Importante: não abra `index.html` via `file://`, porque o projeto depende de `fetch` para carregar a base Prolog.

## Consultas de exemplo

- `inicializar.`
- `conteudo(5, V).`
- `tabuleiro(L).`
- `venceu(x).`
- `vez(J).`

Para consultas com múltiplas soluções, envie `;` para pedir a próxima resposta.
