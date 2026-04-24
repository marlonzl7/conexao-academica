var kpiModel = require("../models/kpiModel");
var { respostaSucesso, respostaErro } = require("../database/dtos/resposta");

async function buscarKpi(req, res) {
    try {
        const { id_kpi } = req.params;

        const resultado = await kpiModel.buscarKpi(id_kpi);

        if(!resultado || resultado.length === 0) {
            return res.status(404).json(respostaErro("KPI não encontrada"));
        }

        return res.status(200).json(respostaSucesso(true, resultado[0], "KPI encontrada com sucesso."));
    } catch(erro) {
        console.log("Erro ao encontrar a KPI: " + erro);

        return res.status(500).json(respostaErro("Erro interno no servidor"));        
    }
}

module.exports = {
    buscarKpi
}