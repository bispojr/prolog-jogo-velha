# Jogo da Velha com Prolog (Tau Prolog)

Projeto acadêmico simples que combina uma interface web com uma base de conhecimento em Prolog para representar regras do Jogo da Velha.

## Ideia do projeto

A proposta é unir:

- **Camada visual (HTML/CSS):** tabuleiro 3x3 e área de consulta.
- **Camada de interação (JavaScript):** leitura de entrada do usuário, envio de consultas e exibição de respostas.
- **Camada lógica (Prolog):** regras do jogo (estado inicial, transições, vitória, empate, estado terminal e consultas auxiliares).

Assim, o projeto permite experimentar lógica declarativa (Prolog) no navegador, sem backend dedicado.

## Integrações

- **Tau Prolog via CDN** no `index.html`:
  - `core.min.js`
  - `lists.min.js`
- **Carga dinâmica da base Prolog** (`base-conhecimento.pl`) com `fetch` no `script.js`.
- **Sessão Prolog no browser** com `pl.create()`, usando:
  - `session.consult(...)`
  - `session.query(...)`
  - `session.answer(...)`

## Tecnologias

- HTML5
- CSS3
- JavaScript (vanilla)
- Prolog (base de conhecimento)
- Tau Prolog (execução Prolog em JavaScript)

## Estrutura

- `index.html`: interface principal e importação das bibliotecas.
- `styles.css`: estilos da página.
- `script.js`: manipulação da interface e integração com Tau Prolog.
- `base-conhecimento.pl`: regras e predicados do jogo.

## Pré-requisitos

Para rodar com `npx serve`, você precisa ter **Node.js** instalado na máquina.
Ao instalar Node.js, o `npm` é instalado junto e, nas versões modernas, o `npx` também.

Verifique se já está disponível:

```bash
node -v
npm -v
npx -v
```

Se o `npx` não existir, instale/atualize o Node.js:

- Opção recomendada (Linux/macOS): usar **nvm** para gerenciar versões.
- Opção simples: instalar Node.js pelo site oficial: <https://nodejs.org/>

Exemplo com nvm:

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
# reinicie o terminal
nvm install --lts
nvm use --lts
```

## Como rodar após clonar

1. Clone o repositório:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd prolog-jogo-velha
   ```

2. Suba um servidor HTTP local (exemplo com `npx serve`):

   ```bash
   npx serve
   ```

3. Abra o endereço exibido no terminal (geralmente `http://localhost:3000`).

> Observação: não abra o `index.html` diretamente via `file://`, pois o projeto usa `fetch` para carregar `base-conhecimento.pl`.

## Exemplos de consultas (na caixa de texto da página)

- `jogador(x).`
- `estado_inicial(E).`
- `jogada_possivel(estado([v,v,v,v,v,v,v,v,v], x), Pos).`

Use `;` para pedir a próxima resposta de uma consulta com múltiplas soluções.
