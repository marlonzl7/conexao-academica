const administradorModel = require("../models/administrador.js");
const { respostaSucesso, respostaErro } = require("../dtos/resposta.js");

async function listar(req, res) {
    try {
        const resultado = await administradorModel.buscarInstituicoes();

        if (!resultado || resultado.length === 0) {
            return res.status(200).send({sucesso: true, dados: []});
        }

        res.status(200).json({
            sucesso: true,
            dados: resultado
        })

    } catch (erro) {
        console.error("Erro no controller:", erro);
        res.status(500).json(respostaErro("Erro ao buscar instituições"));
    }
    
}

async function buscarPorId(req, res) {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json(respostaErro("ID da instituição é obrigatório"));
    }

    try {
        const resultado = await administradorModel.buscarPorId(id);
        res.status(200).json({
            sucesso: true,
            dados: resultado
        });
    } catch (erro) {
        console.error("Erro no controller:", erro);
        res.status(500).json(respostaErro("Erro ao buscar detalhes da instituição"));
    }
}

async function pesquisarInstituicoes(req, res) {
    const termo = (req.query.termo || "").trim();

    try {
        const resultado = await administradorModel.pesquisarInstituicoes(termo);
        res.status(200).json({
            sucesso: true,
            dados: resultado
        });
    }
    catch (erro) {
        console.error("Erro no controller:", erro);
        res.status(500).json(respostaErro("Erro ao pesquisar instituições"));
    }
}

async function alterarStatusUsuario(req, res) {
    const { idUsuario } = req.params;
    const { ativo } = req.body;

    if (idUsuario === undefined || ativo === undefined) {
        return res.status(400).json(respostaErro("Parâmetros inválidos"));
    }

    try {
        await administradorModel.alterarStatusUsuario(idUsuario, ativo ? 1 : 0);
        res.status(200).json({ sucesso: true, mensagem: "Status atualizado" });
    } catch (erro) {
        console.error("Erro no controller:", erro);
        res.status(500).json(respostaErro("Erro ao atualizar status"));
    }
}

module.exports = {
    listar,
    buscarPorId,
    pesquisarInstituicoes,
    alterarStatusUsuario
};
