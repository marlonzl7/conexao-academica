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

module.exports = {
    cadastrarUsuarioDiretor
};