const dashboardDiretorService = require("../services/dashboardDiretorService");
var { respostaSucesso, respostaErro } = require("../dtos/resposta");

async function getKPIs(req, res) {
    try {
        const { idInstituicao, anoInicio, anoFim } = req.query;

        const resultado = await dashboardDiretorService.getKPIs(anoInicio, anoFim, idInstituicao);

        if (!resultado) {
            return res.status(404).json(respostaErro("Nenhum dado encontrado."));
        }

        return res.status(200).json(respostaSucesso(true, resultado, "KPIs carregadas com sucesso."));
    } catch (erro) {
        console.error("Erro na controller (getKPIs):", erro);
        return res.status(500).json(respostaErro("Erro ao buscar KPIs"));
    }
}

async function getAnosDisponiveis(req, res) {
    try {
        const { idInstituicao } = req.query;
        const resultado = await dashboardDiretorService.getAnosDisponiveis(idInstituicao);
        return res.status(200).json(respostaSucesso(true, resultado, "Períodos listados com sucesso."));
    } catch (erro) {
        console.error("Erro na controller (getAnosDisponiveis):", erro);
        return res.status(500).json(respostaErro("Erro ao buscar anos disponíveis"));
    }
}

async function getTaxaEvasaoAnual(req, res) {
    try {
        const { anoInicio, anoFim, idInstituicao } = req.query;
        const resultado = await dashboardDiretorService.getTaxaEvasaoAnual(anoInicio, anoFim, idInstituicao);

        if (!resultado) {
            return res.status(404).json(respostaErro("Nenhum dado encontrado."));
        }

        return res.status(200).json(respostaSucesso(true, resultado, "Dados carregados com sucesso."));
    } catch (erro) {
        console.error("Erro na controller (getTaxaEvasaoAnual):", erro);
        return res.status(500).json(respostaErro("Erro ao buscar taxa de evasão anual"));
    }
}

async function getGraficoEvasao(req, res) {
    try {
        const { anoInicio, anoFim, idInstituicao } = req.query;
        const resultado = await dashboardDiretorService.getGraficoEvasao(anoInicio, anoFim, idInstituicao);
        return res.status(200).json(respostaSucesso(true, resultado));
    } catch (erro) {
        console.error("Erro na controller (getGraficoEvasao):", erro);
        return res.status(500).json(respostaErro("Erro ao buscar gráfico de evasão"));
    }
}

module.exports = {
    getKPIs,
    getAnosDisponiveis,
    getGraficoEvasao,
    getTaxaEvasaoAnual
};