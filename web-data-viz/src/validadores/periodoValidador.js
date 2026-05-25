const { respostaErro } = require("../dtos/resposta");

function validarPeriodo(req, res, next) {
    const { inicio, fim } = req.query;

    if (!inicio && !fim) {
        return next();
    }

    if (!inicio || !fim) {
        return res.status(400).json(
            respostaErro("Os parâmetros inicio e fim devem ser enviados juntos")
        );
    }

    const anoInicio = Number(inicio);
    const anoFim = Number(fim);

    if (isNaN(anoInicio) || isNaN(anoFim)) {
        return res.status(400).json(
            respostaErro("Os parâmetros inicio e fim devem ser números")
        );
    }

    if (anoInicio > anoFim) {
        return res.status(400).json(
            respostaErro("O ano inicial não pode ser maior que o ano final")
        );
    }

    if ((anoFim - anoInicio) > 10) {
        return res.status(400).json(
            respostaErro("O período máximo permitido é de 10 anos.")
        );
    }

    next();
}

module.exports = validarPeriodo;