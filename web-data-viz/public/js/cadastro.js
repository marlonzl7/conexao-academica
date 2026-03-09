const cpfInput = document.getElementById("cpf");
const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const confirmarSenhaInput = document.getElementById("confirmarSenha");
const btnCadastro = document.getElementById("btn-cadastro");

cpfInput.addEventListener("input", () => {
    validarCampo(
        "cpfInvalido",
        "CPF inválido: deve estar no formato 000.000.000-00",
        validarCPF,
        cpfInput
    );
});

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

btnCadastro.addEventListener("click", cadastrar);

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
    if (
        validarCPF(cpfInput) &&
        validarNome(nomeInput) &&
        validarEmail(emailInput) &&
        validarSenha(senhaInput) &&
        validarConfirmacaoSenha(senhaInput, confirmarSenhaInput)
    ) {
        window.location.href = "login.html";
    } else {
        alert("Verifique se todos os campos estão válidos e tente novamente");
    }
}