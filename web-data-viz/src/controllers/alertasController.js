const alertaModel = require('../models/alertaModel.js');
const { respostaSucesso, respostaErro } = require('../dtos/resposta.js');

async function listarAlertas(req, res) {
    try {
        const idInstituicao = req.params.idInstituicao;
        const alertas = await alertaModel.listarAlertas(idInstituicao);
        res.json(alertas);
    } catch (erro) {
        console.log(erro);
        res.status(500).json(erro);
    }
}

async function listarRegras(req, res) {
    try {
        const idInstituicao = req.params.idInstituicao;
        const regras = await alertaModel.listarRegras(idInstituicao);
        res.json(regras);
    } catch (erro) {
        console.log(erro);
        res.status(500).json(erro);
    }
}

async function listarKpisDisponiveis(req, res) {
    try {
        const idInstituicao = req.params.idInstituicao;
        const kpis = await alertaModel.listarKpisDisponiveis(idInstituicao);
        res.json(kpis);
    } catch (erro) {
        console.log("Erro ao buscar KPIs disponíveis:", erro);
        res.status(500).json(respostaErro("Erro ao buscar KPIs disponíveis."));
    }
}

async function cadastrarAlerta(req, res) {
    try {
        const { id_regra, classificacao, observacao, condicao } = req.body;

        if (!id_regra || !classificacao || !condicao) {
            return res.status(400).json(respostaErro("Campos 'id_regra', 'classificacao' e 'condicao' são obrigatórios."));
        }

        const data_hora = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const resultadoBanco = await alertaModel.cadastrarAlerta(id_regra, classificacao, observacao, data_hora, condicao);

        res.status(201).json({
            sucesso: true,
            mensagem: "Alerta cadastrado com sucesso!",
            id_alerta: resultadoBanco.insertId
        });
    } catch (erro) {
        console.log("Erro ao cadastrar alerta:", erro);
        res.status(500).json(respostaErro("Erro interno do servidor ao salvar o alerta."));
    }
}

async function atualizarAlerta(req, res) {
    try {
        const idAlerta = req.params.idAlerta;
        const { id_regra, classificacao, observacao, condicao } = req.body;

        if (!idAlerta) {
            return res.status(404).json(respostaErro("O id do Alerta não foi encontrado."));
        }
        if (!id_regra || !classificacao || !condicao) {
            return res.status(400).json(respostaErro("Campos 'id_regra', 'classificacao' e 'condicao' são obrigatórios."));
        }

        const data_hora = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await alertaModel.atualizarAlerta(idAlerta, id_regra, classificacao, observacao, data_hora, condicao);
        res.status(200).json(respostaSucesso("Alerta atualizado com sucesso."));
    } catch (erro) {
        console.log("Erro ao atualizar alerta: ", erro);
        res.status(500).json(respostaErro("Erro interno do servidor ao atualizar alerta."));
    }
}

async function deletarAlerta(req, res) {
    try {
        const idAlerta = req.params.idAlerta;

        if (!idAlerta) {
            return res.status(404).json(respostaErro("O id do Alerta não foi encontrado."));
        }

        await alertaModel.deletarAlerta(idAlerta);
        res.status(200).json(respostaSucesso("Alerta excluído com sucesso."));
    } catch (erro) {
        console.log("Erro ao deletar alerta: ", erro);
        res.status(500).json(respostaErro("Erro interno do servidor ao deletar alerta."));
    }
}

async function buscarKpi(req, res) {
    try {
        const idInstituicao = req.params.idInstituicao;
        const kpis = await alertaModel.buscarKpi(idInstituicao);
        res.json(kpis);
    } catch (erro) {
        console.log(erro);
        res.status(500).json(erro);
    }
}

async function filtrarAlertas(req, res) {
    try {
        const idInstituicao = req.params.idInstituicao;
        const { classificacao, kpi } = req.query;
        const alertas = await alertaModel.filtrarAlertas(idInstituicao, classificacao, kpi);
        res.json(alertas);
    } catch (erro) {
        console.error("Erro ao filtrar alertas:", erro);
        res.status(500).json(respostaErro("Erro interno ao filtrar alertas."));
    }
}

module.exports = {
    listarAlertas,
    listarRegras,
    listarKpisDisponiveis,
    cadastrarAlerta,
    atualizarAlerta,
    deletarAlerta,
    buscarKpi,
    filtrarAlertas,
};