const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const confirmarSenhaInput = document.getElementById("confirmarSenha");

nomeInput.addEventListener("input", function() {
    if (!validarNome()) {
        logarErro("Nome inválido");
    }
})

emailInput.addEventListener("input", function() {
    if (!validarEmail()) {
        logarErro("Email inválido");
    }
})

senhaInput.addEventListener("input", function() {
    if (!validarSenha()) {
        logarErro("Senha inválida");
    }
})

confirmarSenhaInput.addEventListener("input", function() {
    if (!validarConfirmarSenha()) {
        logarErro("Senhas não coincidem");
    }
})

function logarErro(mensagem) {
    console.log(mensagem);
}

function cadastrar() {
    // implementar a requisição para API e retornar resutlado
}