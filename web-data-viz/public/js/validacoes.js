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
        if (valor.charCodeAt(i) === ".".charCodeAt(0)) {
            return true;
        }
    }

    return false;
}

function validarSenha(input) {
    const valor = input.value;

    if (valor.length < 8) return false;

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
    return senha.value === confirmacao.value;
}
