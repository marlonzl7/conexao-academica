var usuarioModel = require("../models/usuarioModel");
var { respostaSucesso, respostaErro } = require("../dtos/resposta");

async function cadastrarUsuarioDiretor(req, res) {
    try {
        const { id_instituicao, cpf, nome, email, senha } = req.body;

        const resultado = await usuarioModel.cadastrarUsuarioDiretor(id_instituicao, cpf, nome, email, senha);

        return res.status(200).json(respostaSucesso(true, null, "Usuário registrado com sucesso!"));
    } catch (erro) {
        console.log("Erro ao cadastrar usuário: " + erro);

        if (erro === "EMAIL_EXISTENTE") {
            return res.status(409).json(respostaErro("Não foi possível realizar o cadastro", erro));
        }

        if (erro === "DIRETOR_EXISTENTE") {
            return res.status(409).json(respostaErro("Já existe um usuário com cargo diretor nessa instituição"));
        }

        return res.status(500).json(respostaErro("Erro interno no servidor"));
    }
}

//add parte de informações da conta 
async function buscarDadosConta(req, res) {
    try {
        const { id } = req.params;

        const resultado = await usuarioModel.buscarDadosConta(id);

        if (!resultado || resultado.length === 0) {
            return res.status(404).json(respostaErro("Usuário não encontrado"));
        }

        return res
            .status(200)
            .json(respostaSucesso(true, resultado[0], "Dados da conta obtidos com sucesso"));
    } catch (erro) {
        console.log("Erro ao buscar dados da conta: " + erro);
        return res.status(500).json(respostaErro("Erro interno no servidor"));
    }
}

async function atualizarSenha(req, res) {
    try {
        const { id } = req.params;
        const { senhaAtual, novaSenha } = req.body;

        await usuarioModel.atualizarSenha(id, senhaAtual, novaSenha);

        return res.status(200).json(
            respostaSucesso(true, null, "Senha atualizada com sucesso")
        );

    } catch (erro) {
        console.log("Erro ao atualizar senha:", erro);

        if (erro === "SENHA_INVALIDA") {
            return res.status(401).json(respostaErro("Senha atual incorreta"));
        }

        if (erro === "USUARIO_NAO_ENCONTRADO") {
            return res.status(404).json(respostaErro("Usuário não encontrado"));
        }

        return res.status(500).json(respostaErro("Erro interno no servidor"));
    }
}

module.exports = {
    cadastrarUsuarioDiretor,
    buscarDadosConta,
    atualizarSenha
};