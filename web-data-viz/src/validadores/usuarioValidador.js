var { respostaErro } = require("../dtos/resposta");

function validarCadastroUsuario(req, res, next) {
    const { cpf, nome, email, senha, confirmacaoSenha } = req.body;

    const erros = [];

    if (!validarCPF(cpf)) {
        erros.push("CPF deve conter 11 números");
    }

    if (!validarNome(nome)) {
        erros.push("Nome deve conter no mínimo 3 caracteres e só conter letras")
    }

    if (!validarEmail(email)) {
        erros.push("Email deve estar no formato: exemplo@email.com");
    }

    if (!validarSenha(senha)) {
        erros.push("Senha deve conter: no mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 caracter especial");
    }

    if (!validarConfirmacaoSenha(senha, confirmacaoSenha)) {
        erros.push("Senhas não coincidem");
    }

    if (erros.length > 0) {
        return res.status(400).json(respostaErro("Erro: não foi possível realizar o cadastro, formulário contém erros", erros));
    }

    next();
}

function validarCPF(input) {
    if (input === undefined) return false;

    const valor = input.trim();

    if (!(valor.length === 11)) {
        return false;
    }

    for (let i = 0; i < valor.length; i++) {
        const codigoAscii = valor.charCodeAt(i);

        if (!(codigoAscii >= 48 && codigoAscii <= 57)) {
            return false;
        }
    }

    return true;
}

function validarNome(input) {    
    if (input === undefined) return false;

    const valor = input.trim();

    if (valor.length < 3) {
        erros.push("Nome deve ter no mínimo 3 caracteres");
        return false;
    }

    for (let i = 0; i < valor.length; i++) {
        const codigoAscii = valor.charCodeAt(i);

        if (!(
                (codigoAscii === 32) ||
                (validarLetraMinuscula(codigoAscii)) ||
                (validarLetraMaiuscula(codigoAscii))
        )) {
            return false
        }
    }

    return true;
}

function validarEmail(input) {
    if (input === undefined) return false;

    const valor = input.trim();

    let indiceArroba = -1;

    for (let i = 0; i < valor.length; i++) {
        if (valor.charCodeAt(i) === "@".charCodeAt(0)) {
            indiceArroba = i;
            break;
        }
    }

    if (indiceArroba <= 0) return false;

    for (let i = indiceArroba + 1; i < valor.length; i++) {
        if (valor.charCodeAt(i) === ".".charCodeAt(0) && i != valor.length - 1) {
            return true;
        }
    }

    return false;
}

function validarSenha(input) {
    if (input === undefined) return false;
    if (input.length < 8) return false;

    let temMinuscula = false;
    let temMaiuscula = false;
    let temNumero = false;
    let temCaractereEspecial = false;

    for (let i = 0; i < input.length; i++) {
        let codigoAscii = input.charCodeAt(i);

        if (validarLetraMinuscula(codigoAscii)) temMinuscula = true;
        if (validarLetraMaiuscula(codigoAscii)) temMaiuscula = true;
        if (validarNumero(codigoAscii)) temNumero = true;
        if (validarCaractereEspecial(codigoAscii)) temCaractereEspecial = true;
    }

    return temMinuscula && temMaiuscula && temNumero && temCaractereEspecial;
}

function validarLetraMinuscula(codigoAscii) {
    if (!(codigoAscii >= 97 && codigoAscii <= 122)) {
        return false;
    }

    return true;
}

function validarLetraMaiuscula(codigoAscii) {
    return codigoAscii >= 65 && codigoAscii <= 90;
}

function validarNumero(codigoAscii) {
    return codigoAscii >= 48 && codigoAscii <= 57;
}

function validarCaractereEspecial(codigoAscii) {
    return (codigoAscii >= 32 && codigoAscii <= 47) ||
           (codigoAscii >= 58 && codigoAscii <= 64) ||
           (codigoAscii >= 91 && codigoAscii <= 96) ||
           (codigoAscii >= 123 && codigoAscii <= 126);
}

function validarConfirmacaoSenha(senha, confirmacao) {
    return senha === confirmacao;
}

module.exports = {
    validarCadastroUsuario
};