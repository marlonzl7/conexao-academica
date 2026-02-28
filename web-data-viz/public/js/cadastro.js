const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const confirmarSenhaInput = document.getElementById("confirmarSenha");

nomeInput.addEventListener("input", () => {
    validarCampo(
        "nomeInvalido",
        "Nome inválido: deve ter no mínimo 3 caracteres e só conter letras",
        validarNome,
        nomeInput
    );
});

emailInput.addEventListener("input", () => {
    validarCampo(
        "emailInvalido",
        "Email inválido: deve seguir o formato 'exemplo@email.com'",
        validarEmail,
        emailInput
    );
});

senhaInput.addEventListener("input", () => {
    validarCampo(
        "senhaInvalida",
        "Senha inválida: Deve ter no mínimo 8 caracteres, maiúsculas, minúsculas, números e caracteres especiais",
        validarSenha,
        senhaInput
    );

    confirmarSenhaInput.dispatchEvent(new Event("input"));
});

confirmarSenhaInput.addEventListener("input", () => {
    validarCampo(
        "confirmarSenhaInvalida",
        "Senha inválida: Senhas não coincidem",
        validarConfirmacaoSenha,
        senhaInput,
        confirmarSenhaInput
    );
});

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

function cadastrar() {
    // implementar a requisição para API e retornar resutlado
}