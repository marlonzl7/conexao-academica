const alertaModel = require('../models/alertaModel.js');
const { respostaSucesso, respostaErro } = require('../dtos/resposta.js');

async function listarRegras(req, res) {
    try {
        const idInstituicao = req.params.idInstituicao;

        const regras =
            await alertaModel.listarRegras(idInstituicao);

        res.json(regras);
    } catch (erro) {
        console.log(erro);
        res.status(500).json(erro);
    }
}

module.exports = {
    listarRegras
};