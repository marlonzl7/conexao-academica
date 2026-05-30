var dashboardCoordenadorService = require("../services/dashboardCoordenadorService");

var { respostaSucesso, respostaErro } = require("../dtos/resposta");

async function listarKPIs(req, res) {
    try {
        const { idCurso, inicio, fim } = req.query;

        const resultado = await dashboardCoordenadorService.listarKPIs({
            idCurso,
            inicio,
            fim
        });

        if (!resultado) {
            return res.status(404).json(respostaErro("Nenhum dado encontrado."));
        }

        return res.status(200).json(
            respostaSucesso(
                true,
                resultado,
                "KPIs carregadas com sucesso."
            )
        );

    } catch (erro) {
        console.log(erro);

        return res.status(500).json(
            respostaErro("Erro interno no servidor")
        );
    }
}

async function listarTaxaEvasaoAnual(req, res) {
    try {
        const { idCurso, inicio, fim } = req.query;

        const resultado =
            await dashboardCoordenadorService.listarTaxaEvasaoAnual({
                idCurso,
                inicio,
                fim
            });

        if (!resultado) {
            return res.status(404).json(respostaErro("Nenhum dado encontrado."));
        }

        return res.status(200).json(
            respostaSucesso(
                true,
                resultado,
                "Dados carregados com sucesso."
            )
        );

    } catch (erro) {
        console.log(erro);

        return res.status(500).json(
            respostaErro("Erro interno no servidor")
        );
    }
}

async function listarSituacaoAlunos(req, res) {
    try {
        const { idCurso, inicio, fim } = req.query;

        const resultado =
            await dashboardCoordenadorService.listarSituacaoAlunos({
                idCurso,
                inicio,
                fim
            });

        if (!resultado) {
            return res.status(404).json(respostaErro("Nenhum dado encontrado."));
        }

        return res.status(200).json(
            respostaSucesso(
                true,
                resultado,
                "Dados carregados com sucesso."
            )
        );

    } catch (erro) {
        console.log(erro);

        return res.status(500).json(
            respostaErro("Erro interno no servidor")
        );
    }
}

async function listarPeriodos(req, res) {
    try {
        const { idCurso } = req.query;

        const resultado =
            await dashboardCoordenadorService.listarPeriodos(idCurso);

        return res.status(200).json(respostaSucesso(
            true,
            resultado,
            "Períodos listados com sucesso"
        ));
    } catch (erro) {
        console.log(erro);

        return res.status(500).json(
            respostaErro("Erro internon no servidor")
        );
    }
}

module.exports = {
    listarKPIs,
    listarTaxaEvasaoAnual,
    listarSituacaoAlunos,
    listarPeriodos
};