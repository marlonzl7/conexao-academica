const dashboardDiretorModel = require("../models/dashboardDiretor");

var { respostaSucesso, respostaErro } = require("../dtos/resposta");

async function getKPIs(req, res) {
    try{
        const idInstituicao = req.query.idInstituicao;
        const anoInicio = req.query.anoInicio;
        const anoFim = req.query.anoFim;

        const responseFromModel = await dashboardDiretorModel.getKPIs(anoInicio, anoFim, idInstituicao);
        return res.status(200).json(respostaSucesso(true, responseFromModel));
    } catch (erro) {
        console.error("Erro na controller (getKPIs):", erro);
        return res.status(500).json(respostaErro("Erro ao buscar KPIs"));
    }
}

async function getAnosDisponiveis(req, res) {
    try {
        const idInstituicao = req.query.idInstituicao;

        const responseFromModel = await dashboardDiretorModel.getAnosDisponiveis(idInstituicao);
        return res.status(200).json(respostaSucesso(true, responseFromModel));
    }
    catch (erro) {
        console.error("Erro na controller (getAnosDisponiveis):", erro);
        return res.status(500).json(respostaErro("Erro ao buscar anos disponíveis"));
    }
}
    
async function getGraficoEvasao(req, res) {
    try {
        const anoInicio = req.query.anoInicio;
        const anoFim = req.query.anoFim;
        const idInstituicao = req.query.idInstituicao;

        const responseFromModel = await dashboardDiretorModel.getGraficoEvasao(anoInicio, anoFim, idInstituicao);
        return res.status(200).json(respostaSucesso(true, responseFromModel));
    } catch (erro) {
        console.error("Erro na controller (getGraficoEvasao):", erro);
        return res.status(500).json(respostaErro("Erro ao buscar gráfico de evasão"));
    }
}

async function getTaxaEvasaoAnual(req, res) {
    try{
        const anoInicio = req.query.anoInicio;
        const anoFim = req.query.anoFim;
        const idInstituicao = req.query.idInstituicao;

        const responseFromModel = await dashboardDiretorModel.getGraficoResumoEvasao(anoInicio, anoFim, idInstituicao);
        return res.status(200).json(respostaSucesso(true, responseFromModel));
    }
    catch (erro) {
        console.error("Erro na controller (getTaxaEvasaoAnual):", erro);
        return res.status(500).json(respostaErro("Erro ao buscar taxa de evasão anual"));
    }
}

module.exports = {
    getKPIs,
    getAnosDisponiveis,
    getGraficoEvasao,
    getTaxaEvasaoAnual
};