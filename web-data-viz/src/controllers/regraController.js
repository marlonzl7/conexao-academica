const regraModel = require("../models/regraModel");
const { respostaSucesso, respostaErro } = require("../database/dtos/resposta");

async function listarRegras(req, res) {
    try {
        const idUsuario = req.query.id_usuario;
	
	console.log("Listar regras. ID_USUARIO: " + idUsuario);

        const resultado = await regraModel.listarRegras(idUsuario);
        return res.status(200).json(respostaSucesso(true, resultado, "Regras listadas com sucesso."));
    } catch (erro) {
        console.log("Não foi possível listar as regras: " + erro);
        return res.status(500).json(respostaErro("Erro interno no servidor"));
    }
}

async function cadastrarRegra(req, res) {
    try {
        const { idUsuario, kpi, classificacao, limiteInferior, limiteSuperior } = req.body;

        await regraModel.cadastrarRegra(idUsuario, kpi, classificacao, limiteInferior, limiteSuperior);

        return res.status(201).json(respostaSucesso(true, null, "Regra registrada com sucesso!"));
    } catch(erro) {
        console.log("Erro ao cadastrar a regra: " + erro);

        return res.status(500).json(respostaErro("Erro interno no servidor"));        
    }
}

async function atualizarRegra(req, res) {
    try {
        const { id } = req.params;
        const { classificacao, limiteInferior, limiteSuperior } = req.body;

        await regraModel.atualizarRegra(id, classificacao, limiteInferior, limiteSuperior)

        return res.status(200).json(respostaSucesso(true, null, "Regra atualizada com sucesso!"))
    } catch (erro) {
        console.log("Erro ao editar a regra: " + erro);

        return res.status(500).json(respostaErro("Erro interno no servidor"));
    }
}

async function deletarRegra(req, res) {
    try {
        const { id } = req.params;

        await regraModel.deletarRegra(id);

        return res.status(200).json(respostaSucesso(true, null, "Regra deletada com sucesso!"));
    } catch (erro) {
        console.log("Erro ao apagar a regra: " + erro);

        return res.status(500).json(respostaErro("Erro interno no servidor"));
    }
}

module.exports = {
    listarRegras,
    cadastrarRegra,
    atualizarRegra,
    deletarRegra
};
