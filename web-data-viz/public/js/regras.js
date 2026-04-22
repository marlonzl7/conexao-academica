
document.addEventListener("DOMContentLoaded", () => {
    iniciar();
});

function abrirModal(id) {
    document.getElementById(id).classList.remove("hidden");
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
            classificacaoInput
        )
    })

    limiteInferiorInput.addEventListener("input", () => {
        validarCampo(
            "limiteInferiorInvalido",
            "Limite inferior inválido: deve ser maior que 0 e menor que o limite superior.",
            validarLimiteInferior,
            limiteInferiorInput
        )
    })

    limiteSuperiorInput.addEventListener("input", () => {
        validarCampo(
            "limiteSuperiorInvalido",
            "Limite superior inválido: deve ser menor que 100 e maior que o limite inferior.",
            validarLimiteSuperior,
            limiteSuperiorInput
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
    if(
        validarClassificacao(classificacaoInput) &&
        validarLimiteInferior(limiteInferiorInput) &&
        validarLimiteSuperior(limiteSuperiorInput)
    ) {
        const url = '/cadastrar/regra';
        
        const dados = {
            classifacao: classificacaoInput.value,
            limiteInferior: limiteInferiorInput.value,
            limiteSuperior: limiteSuperiorInput.value
        }

        try {
            const res = await fetch (url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            const resposta = await res.json();

            if(!res.ok) {
                alert(resposta.mensagem || "Erro ao realizar o cadastro de regras");
                return;
            }

            alert(resposta.mensagem)
            fecharModal();
        } catch (erro) {
            console.error(erro);
            alert("Erro ao se conectar com o servidor");
        }

    } else {
        alert("Verifique se todos os campos estão válidos e tente novamente.")
    }
}

function editarRegra() {

}

function apagarRegra() {

}