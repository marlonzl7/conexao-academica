var { respostaErro } = require("../dtos/resposta");

function validarLimitesRegra(req, res, next) {
    const { limiteInferior, limiteSuperior } = req.body; // corrigido
    const erros = [];

    if (!validarLimiteInferior(limiteInferior, limiteSuperior)) {
        erros.push("Limite inferior deve ser maior ou igual a zero e menor que o limite superior.");
    }

    if (!validarLimiteSuperior(limiteSuperior, limiteInferior)) {
        erros.push("Limite superior deve ser menor ou igual a cem e maior que o limite inferior.");
    }

    if (erros.length > 0) {
        return res.status(400).json(respostaErro("Formulário contém erros.", erros));
    }

    next();
}
function validarLimiteInferior(inferior, superior) {
    if (inferior === undefined || inferior === null) return false;
    const valor = parseFloat(inferior);
    const sup = parseFloat(superior);
    return !isNaN(valor) && valor >= 0 && (isNaN(sup) || valor < sup);
}

function validarLimiteSuperior(superior, inferior) {
    if (superior === undefined || superior === null) return false;
    const valor = parseFloat(superior);
    const inf = parseFloat(inferior);
    return !isNaN(valor) && valor <= 100 && (isNaN(inf) || valor > inf);
}


module.exports = {
    validarLimitesRegra
};