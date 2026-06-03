const alertaModel = require('../models/alertaModel');
const { respostaSucesso, respostaErro } = require('../dtos/resposta.js');

async function getAllAlerts(req, res) {
    try {
        const resultado = await alertaModel.getAllAlerts();
        res.status(200).json(respostaSucesso(true, resultado));
    } catch (erro) {
        console.error("Erro no controller:", erro);
        res.status(500).json(respostaErro("Erro ao buscar alertas"));
    }
}

async function createAlert(req, res) {
    const { id_regra, classificacao, observacao } = req.body;
    if (!id_regra || !classificacao || !observacao) {
        return res.status(400).json(respostaErro("Todos os campos são obrigatórios"));
    }
    try {
        const resultado = await alertaModel.createAlert({ id_regra, classificacao, observacao });
        res.status(201).json(respostaSucesso(true, resultado));
    } catch (erro) {
        console.error("Erro no controller:", erro);
        res.status(500).json(respostaErro("Erro ao criar alerta"));
    }
}

async function deleteAlert(req, res) {
    const { id } = req.params;
    try {
        await alertaModel.deleteAlert(id);
        res.status(200).json(respostaSucesso(true, "Alerta deletado"));
    }
        catch (erro) {
        console.error("Erro no controller:", erro);
        res.status(500).json(respostaErro("Erro ao deletar alerta"));
    }
}

async function getAlertsByFilter(req, res) {
    const { id_regra, classificacao } = req.query;
    try {
        const resultado = await alertaModel.getAlertsByFilter({ id_regra, classificacao });
        res.status(200).json(respostaSucesso(true, resultado));
    }
    catch (erro) {
        console.error("Erro no controller:", erro);
        res.status(500).json(respostaErro("Erro ao buscar alertas por filtro"));
    }
}

module.exports = {
    getAllAlerts,
    createAlert,
    deleteAlert,
    getAlertsByFilter
};