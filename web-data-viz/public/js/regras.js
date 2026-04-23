document.addEventListener("DOMContentLoaded", () => {
    iniciar();
});

function abrirModal(id) {
    document.getElementById(id).classList.remove("hidden");
}

function abrirEdicao(id, classificacao, kpi, inferior, superior) {
    document.getElementById("edicao-regra-id").value = id;
    document.getElementById("edicao-classificacao").value = classificacao;
    document.getElementById("edicao-kpi").value = kpi;
    document.getElementById("edicao-limite_inferior").value = inferior;
    document.getElementById("edicao-limite_superior").value = superior;
    abrirModal("modal-overlay-edicao");
}

function abrirDelecao(id) {
    document.getElementById("delecao-regra-id").value = id;
    abrirModal("modal-overlay-delecao");
}

function fecharModal(id) {
    document.getElementById(id).classList.add("hidden");
}

document.querySelectorAll(".overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) fecharModal(overlay.id);
    });
});

function iniciar() {
    const classificacaoInput = document.getElementById("classificacao");
    const limiteInferiorInput = document.getElementById("limite-inferior");
    const limiteSuperiorInput = document.getElementById("limite-superior");

    classificacaoInput.addEventListener("input", () => {
        validarCampo(
            "classificacaoInvalida",
            "Classificação inválida: deve ser conciso com a KPI.",
            validarClassificacao,
            classificacaoInput.value
        )
    })

    limiteInferiorInput.addEventListener("input", () => {
        validarCampo(
            "limiteInferiorInvalido",
            "Limite inferior inválido: deve ser maior que 0 e menor que o limite superior.",
            validarLimiteInferior,
            limiteInferiorInput.value,
            limiteSuperiorInput.value
        )
    })

    limiteSuperiorInput.addEventListener("input", () => {
        validarCampo(
            "limiteSuperiorInvalido",
            "Limite superior inválido: deve ser menor que 100 e maior que o limite inferior.",
            validarLimiteSuperior,
            limiteSuperiorInput.value,
            limiteInferiorInput.value
        )
    })
}

function validarCampo(spanId, mensagemErro, funcValidacao, ...parametros) {
    const erroSpan = document.getElementById(spanId);
    const divErro = erroSpan.parentElement;

    if (!funcValidacao(...parametros)) {
        erroSpan.textContent = mensagemErro;
        divErro.classList.add("ativo");
    } else {
        erroSpan.textContent = "";
        divErro.classList.remove("ativo");
    }
}


async function cadastrarRegra() {
    const classificacaoInput = document.getElementById("cadastro-classificacao");
    const limiteInferiorInput = document.getElementById("cadastro-limite_inferior");
    const limiteSuperiorInput = document.getElementById("cadastro-limite_superior");

    if (
        validarClassificacao(classificacaoInput) &&
        validarLimiteInferior(limiteInferiorInput) &&
        validarLimiteSuperior(limiteSuperiorInput)
    ) {
        const url = `/cadastrar/regra`;
        const dados = {
            classificacao: classificacaoInput.value,
            limiteInferior: limiteInferiorInput.value,
            limiteSuperior: limiteSuperiorInput.value,
        };

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados),
            });

            const resposta = await res.json();

            if (!res.ok) {
                alert(resposta.mensagem || "Erro ao realizar o cadastro de regras");
                return;
            }

            alert(resposta.mensagem);
            fecharModal("modal-overlay-cadastro");
        } catch (erro) {
            console.error(erro);
            alert("Erro ao se conectar com o servidor");
        }
    } else {
        alert("Verifique se todos os campos estão válidos e tente novamente.");
    }
}

async function editarRegra() {
    const idRegra = document.getElementById("edicao-regra-id").value;
    const classificacaoInput = document.getElementById("edicao-classificacao");
    const kpiInput = document.getElementById("edicao-kpi");
    const limiteInferiorInput = document.getElementById("edicao-limite_inferior");
    const limiteSuperiorInput = document.getElementById("edicao-limite_superior");

    if (
        validarClassificacao(classificacaoInput) &&
        validarLimiteInferior(limiteInferiorInput) &&
        validarLimiteSuperior(limiteSuperiorInput)
    ) {
        const url = `/editar/regra/${idRegra}`
        const dados = {
            classificacao: classificacaoInput.value,
            kpi: kpiInput.value,
            limiteInferior: limiteInferiorInput.value,
            limiteSuperior: limiteSuperiorInput.value
        };

        try {
            const res = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados),
            });

            const resposta = await res.json();

            if(!res.ok) {
                alert(resposta.mensagem || "Erro ao realizar a edição de regras.");
                return;
            }

            alert(resposta.mensagem);
            fecharModal("modal-overlay-edicao");
        } catch (erro) {
            console.error(erro);
            alert("Erro ao se conectar com o servidor.")
        }
    } else {
        alert("Verifique se todos os campos estão válidos e tente novamente.");        
    }
}


async function deletarRegra() {
    const idRegra = document.getElementById("delecao-regra-id").value;
    
    if(!id) {
        alert("Nenhum registro encontrado para exclusão.");
        return;
    }

    const url = `/deletar/regra/${idRegra}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json"  },
        });

        const resposta = await res.json();
    
        if(!res.ok) {
            alert(resposta.mensagem || "Erro ao deletar a regra.");
            return;
        }

        alert(resposta.mensagem);
        fecharModal("modal-overlay-delecao");
    } catch (erro) {
        console.error(erro);
        alert("Erro ao se conectar com o servidor.");
    }
}