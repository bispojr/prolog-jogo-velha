const estados = ["", "X", "O"];

document.querySelectorAll("td").forEach(td => {
    td.onclick = () => {
        const atual = td.textContent.trim();
        const indice = estados.indexOf(atual);
        td.textContent = estados[(indice + 1) % estados.length];
    };
});

let session = pl.create();
let baseCarregada = false;

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
        success: () => {
            baseCarregada = true;
            botao.disabled = false;
            mostrar("Base carregada. Execute uma consulta.", "sucesso");
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

function proximaResposta() {

    session.answer({

        success(answer) {
            mostrar(session.format_answer(answer), "sucesso");
        },

        fail() {
            mostrar("false.", "falha");
        },

        error(err) {
            mostrar(err, "erro");
        },

        limit() {
            mostrar("Limite atingido.", "erro");
        }

    });

}

function executarConsulta() {

    if (!baseCarregada) {
        mostrar("Aguarde: base Prolog ainda esta carregando.", "erro");
        return;
    }

    const q = consulta.value.trim();

    if (q === ";") {
        proximaResposta();
        return;
    }

    session.query(q, {

        success() {
            proximaResposta();
        },

        error(err) {
            mostrar(err, "erro");
        }

    });

}

botao.onclick = executarConsulta;

consulta.addEventListener("keydown", e => {

    if (e.key === "Enter") {
        executarConsulta();
    }

});