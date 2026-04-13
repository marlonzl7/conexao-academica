var { respostaErro } = require("../database/dtos/resposta");

function validarCadastroRegra(req, res, next) {
    const { limite_inferior, limite_superior } = req.body;

    const erros = [];

    if (!validarLimiteInferior(limite_inferior)) {
        erros.push("Limite inferior deve ser maior que zero e menor que o limite superior.");
    }

    if (!validarLimiteSuperior(limite_superior)) {
        erros.push("Limite superior deve ser menor que cem e maior que o limite inferior.")
    }

    if(erros.length > 0) {
        return res.status(400).json(respostaErro("Erro: não foi possível realizar a criação de regras, formulário contém erros", erros));
    }

    next();
}

function validarLimiteInferior(input) {
    if (input === undefined) return false;

    const valor = input.trim();

    if (valor < 0 || valor > limite_superior) {
        return false;
    }

    return true;
}

function validarLimiteSuperior(input) {
    if (input === undefined) return false;

    const valor = input.trim();

    if (valor > 100 || valor < limite_inferior) {
        return false;
    }

    return true;
}