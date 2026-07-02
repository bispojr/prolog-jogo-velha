const estados = ["", "X", "O"];

document.querySelectorAll("td").forEach(td => {
    td.onclick = () => {
        const atual = td.textContent.trim();
        const indice = estados.indexOf(atual);
        td.textContent = estados[(indice + 1) % estados.length];
    };
});

let session = pl.create();

async function carregarBase() {

    const resposta = await fetch("base-conhecimento.pl");
    const codigo = await resposta.text();

    session.consult(codigo, {
        success: () => console.log("Base carregada."),
        error: err => console.error(err)
    });

}

carregarBase();

const consulta = document.getElementById("consulta");
const botao = document.getElementById("executar");
const saida = document.getElementById("saida");

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