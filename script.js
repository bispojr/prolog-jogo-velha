let session = pl.create();
let baseCarregada = false;
let consultaPendente = false;

const celulas = Array.from(document.querySelectorAll("td[data-pos]"));

const consulta = document.getElementById("consulta");
const botao = document.getElementById("executar");
const saida = document.getElementById("saida");

botao.disabled = true;

async function carregarBase() {

    mostrar("Carregando base Prolog...", "falha");

    let codigo;

    try {
        const resposta = await fetch("base-conhecimento.pl");

        if (!resposta.ok) {
            throw new Error(`Falha HTTP ${resposta.status} ao carregar base-conhecimento.pl`);
        }

        codigo = await resposta.text();
    } catch (err) {
        baseCarregada = false;
        botao.disabled = true;
        mostrar(`Erro ao carregar arquivo da base: ${err}`, "erro");
        console.error(err);
        return;
    }

    session.consult(codigo, {
        success: async () => {
            baseCarregada = true;
            botao.disabled = false;

            const init = await executarQueryUnica("inicializar.");
            if (init.status === "error") {
                mostrar(`Erro ao inicializar base: ${init.error}`, "erro");
                return;
            }

            await sincronizarTabuleiro();
            mostrar("Base carregada. Tabuleiro inicializado.", "sucesso");
            console.log("Base carregada.");
        },
        error: err => {
            baseCarregada = false;
            botao.disabled = true;
            mostrar(`Erro ao compilar base Prolog: ${err}`, "erro");
            console.error(err);
        }
    });

}

carregarBase();

function mostrar(texto, classe) {
    saida.innerHTML = `<span class="${classe}">${texto}</span>`;
}

function valorTabuleiroParaTexto(valor) {
    if (valor === "x") {
        return "X";
    }

    if (valor === "o") {
        return "O";
    }

    return "";
}

function extrairValorVariavel(formatado, variavel) {
    const padrao = new RegExp(`${variavel}\\s*=\\s*([^,;]+)`);
    const match = formatado.match(padrao);
    return match ? match[1].trim() : null;
}

function executarQueryUnica(query) {
    return new Promise(resolve => {
        session.query(query, {
            success() {
                session.answer({
                    success(answer) {
                        const formatado = session.format_answer(answer);
                        resolve({ status: "success", answer, formatado });
                    },
                    fail() {
                        resolve({ status: "fail" });
                    },
                    error(err) {
                        resolve({ status: "error", error: err });
                    },
                    limit() {
                        resolve({ status: "limit" });
                    }
                });
            },
            error(err) {
                resolve({ status: "error", error: err });
            }
        });
    });
}

async function sincronizarTabuleiro() {
    for (let pos = 1; pos <= 9; pos += 1) {
        const resposta = await executarQueryUnica(`conteudo(${pos}, V).`);
        if (resposta.status !== "success") {
            celulas[pos - 1].textContent = "";
            continue;
        }

        const valor = extrairValorVariavel(resposta.formatado, "V");
        celulas[pos - 1].textContent = valorTabuleiroParaTexto(valor);
    }
}

function consultaAlteraBase(query) {
    return /\b(assertz|asserta|retractall|retract|abolish|jogar|inicializar|trocar_vez|bot_bobinho)\b/i.test(query);
}

async function jogarNoTabuleiro(pos) {
    if (!baseCarregada || consultaPendente) {
        return;
    }

    consultaPendente = true;
    const resposta = await executarQueryUnica(`jogar(${pos}).`);

    if (resposta.status === "success") {
        await sincronizarTabuleiro();
        mostrar(`Jogada aplicada na posicao ${pos}.`, "sucesso");
    } else if (resposta.status === "fail") {
        mostrar("Jogada invalida para a posicao selecionada.", "falha");
    } else {
        mostrar(`Erro ao jogar: ${resposta.error ?? "desconhecido"}`, "erro");
    }

    consultaPendente = false;
}

celulas.forEach(celula => {
    celula.onclick = () => {
        const pos = Number(celula.dataset.pos);
        jogarNoTabuleiro(pos);
    };
});

function proximaResposta() {
    return new Promise(resolve => {
        session.answer({

            success(answer) {
                const formatado = session.format_answer(answer);
                mostrar(formatado, "sucesso");
                resolve({ status: "success", formatado });
            },

            fail() {
                mostrar("false.", "falha");
                resolve({ status: "fail" });
            },

            error(err) {
                mostrar(err, "erro");
                resolve({ status: "error", error: err });
            },

            limit() {
                mostrar("Limite atingido.", "erro");
                resolve({ status: "limit" });
            }

        });
    });
}

function executarConsultaInicial(query) {
    return new Promise(resolve => {
        session.query(query, {
            success() {
                proximaResposta().then(resolve);
            },
            error(err) {
                mostrar(err, "erro");
                resolve({ status: "error", error: err });
            }
        });
    });
}

async function executarConsulta() {

    if (!baseCarregada) {
        mostrar("Aguarde: base Prolog ainda esta carregando.", "erro");
        return;
    }

    const q = consulta.value.trim();

    if (q === "") {
        mostrar("Digite uma consulta Prolog.", "erro");
        return;
    }

    if (q === ";") {
        await proximaResposta();
        return;
    }

    consultaPendente = true;

    const alteraBase = consultaAlteraBase(q);
    const resposta = await executarConsultaInicial(q);

    if (alteraBase && resposta.status !== "error") {
        await sincronizarTabuleiro();
    }

    consultaPendente = false;

}

botao.onclick = executarConsulta;

consulta.addEventListener("keydown", e => {

    if (e.key === "Enter") {
        executarConsulta();
    }

});