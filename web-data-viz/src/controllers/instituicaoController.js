const instituicaoModel = require("../models/instituicaoModel");
const { respostaSucesso, respostaErro } = require("../dtos/resposta");

async function listar(req, res) {
    try {
        const { busca } = req.query;

        if (busca) {
            const resultado = await instituicaoModel.buscar(busca);
            return res.status(200).json(respostaSucesso(true, resultado, "Instituições buscadas com sucesso"));
        }

        const resultado = await instituicaoModel.listar();

        return res.status(200).json(respostaSucesso(true, resultado, "Instituições listadas com sucesso"));
    } catch (erro) {
        console.log("Não foi possível listar as instituições: " + erro);
        return res.status(500).json(respostaErro("Erro interno no servidor"));
    }
}

module.exports = {
    listar
}