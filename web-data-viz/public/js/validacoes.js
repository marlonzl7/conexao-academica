// Cadastro e Login

function validarCPF(input) {
    const valor = input.value.trim();

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
    const valor = input.value.trim();

    if (valor.length < 3) return false;

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
    const valor = input.value.trim();

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
    const valor = input.value;

    if (valor.length < 8) return "Senha deve ter no mínimo 8 caracteres";

    let temMinuscula = false;
    let temMaiuscula = false;
    let temNumero = false;
    let temCaractereEspecial = false;

    for (let i = 0; i < valor.length; i++) {
        let codigoAscii = valor.charCodeAt(i);

        if (validarLetraMinuscula(codigoAscii)) temMinuscula = true;
        if (validarLetraMaiuscula(codigoAscii)) temMaiuscula = true;
        if (validarNumero(codigoAscii)) temNumero = true;
        if (validarCaractereEspecial(codigoAscii)) temCaractereEspecial = true;
    }

    if(!temMaiuscula) return "Senha deve conter pelo menos uma letra maiúscula"
    if(!temMinuscula) return "Senha deve conter pelo menos uma letra minúscula"
    if(!temNumero) return "Senha deve conter pelo menos um número"
    if(!temCaractereEspecial) return "Senha deve conter pelo menos um caractere especial"

    return null;
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
    return senha.value === confirmacao.value;
}

// Regras de Classificação

function validarClassificacao(input) {
    return input.value.trim() !== "";

}

function validarLimiteInferior(inputInferior, inputSuperior) {
    const valor = parseFloat(inputInferior.value);
    const sup = parseFloat(inputSuperior.value);
    return !isNaN(valor) && valor >= 0 && (isNaN(sup) || valor < sup);
}

function validarLimiteSuperior(inputSuperior, inputInferior) {
    const valor = parseFloat(inputSuperior.value);
    const inf = parseFloat(inputInferior.value);
    return !isNaN(valor) && valor >= 0 && (isNaN(inf) || valor > inf);
}

function validarMensagem(input){
    const valor = input.value.trim();

    if (valor.length < 10) return false;

    return true;
}

function validarDescricao(input) {
    return input.value.trim().length >= 3;
}