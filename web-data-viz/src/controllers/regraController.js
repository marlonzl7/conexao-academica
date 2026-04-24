var regraModel = require("../models/regraModel");
var { respostaSucesso, respostaErro } = require("../database/dtos/resposta");

async function cadastrarRegra(req, res) {
    try {
        const { id_usuario, id_kpi, classificacao, limite_inferior, limite_superior } = req.body;

        const resultado = await regraModel.cadastrarRegra(id_usuario, id_kpi, classificacao, limite_inferior, limite_superior);

        return res.status(200).json(respostaSucesso(true, null, "Regra registrada com sucesso!"));
    } catch(erro) {
        console.log("Erro ao cadastrar a regra: " + erro);

        return res.status(500).json(respostaErro("Erro interno no servidor"));        
    }
}

async function atualizarRegra(req, res) {
    try {
        const { id_kpi, classificacao, limite_inferior, limite_superior } = req.body;

        const resultado = await regraModel.atualizarRegra(id_kpi, classificacao, limite_inferior, limite_superior)

        return res.status(200).json(respostaSucesso(true, null, "Regra atualizada com sucesso!"))
    } catch (erro) {
        console.log("Erro ao editar a regra: " + erro);

        return res.status(500).json(respostaErro("Erro interno no servidor"));
    }
}

module.exports = {
    cadastrarRegra,
    atualizarRegra
};