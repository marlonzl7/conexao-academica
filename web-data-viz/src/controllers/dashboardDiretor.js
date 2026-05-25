const dashboardDiretorModel = require("../models/dashboardDiretor");

async function getKPIs(req, res) {
    try{
        const idInstituicao = req.query.idInstituicao;
        const anoInicio = req.query.anoInicio;
        const anoFim = req.query.anoFim;

        const responseFromModel = await dashboardDiretorModel.getKPIs(anoInicio, anoFim, idInstituicao);
        return res.status(200).json(responseFromModel);
    } catch (erro) {
        console.error("Erro na controller (getKPIs):", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

async function getAnosDisponiveis(req, res) {
    try {
        const idInstituicao = req.query.idInstituicao;

        const responseFromModel = await dashboardDiretorModel.getAnosDisponiveis(idInstituicao);
        return res.status(200).json(responseFromModel);
    }
    catch (erro) {
        console.error("Erro na controller (getAnosDisponiveis):", erro);
        return res.status(500).json({ erro: erro.message });
    }
}
    
async function getGraficoEvasao(req, res) {
    try {
        const anoInicio = req.query.anoInicio;
        const anoFim = req.query.anoFim;
        const idInstituicao = req.query.idInstituicao;

        const responseFromModel = await dashboardDiretorModel.getGraficoEvasao(anoInicio, anoFim, idInstituicao);
        return res.status(200).json(responseFromModel);
    } catch (erro) {
        console.error("Erro na controller (getGraficoEvasao):", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

module.exports = {
    getKPIs,
    getAnosDisponiveis,
    getGraficoEvasao
};