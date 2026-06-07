var usuarioModel = require("../models/usuarioModel");
var regraService = require("../services/regraService");
var { respostaSucesso, respostaErro } = require("../dtos/resposta");

async function login(req, res) {
    try {
        const {email, senha} = req.body;

        const resultado = await usuarioModel.login(email, senha);

        return res.status(200).json(respostaSucesso(true, resultado, "Usuário autenticado com sucesso"));
    } catch (erro) {
        console.error("Erro de autenticação: " + erro);

        if (erro === "CREDENCIAIS_INVALIDAS" || erro === "USUARIO_INATIVO") {
            return res.status(401).json(respostaErro("Credencias Inválidas"));
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
async function atualizarDados(req, res) {
    try {
        const { id } = req.params;
        const { nome, email } = req.body;

        await usuarioModel.atualizarDados(id, nome, email);

        return res
            .status(200)
            .json(respostaSucesso(true, null, "Dados atualizados com sucesso"));
    } catch (erro) {
        console.log("Erro ao atualizar dados:", erro);
        return res.status(500).json(respostaErro("Erro interno no servidor"));
    }
}

async function deletarUsuario(req, res) {
    try {
        const { id } = req.params; // Pega o ID da URL

        if (!id) {
            return res.status(400).json(respostaErro("ID do usuário não fornecido"));
        }

        await usuarioModel.deletarUsuario(id);

        return res.status(200).json(
            respostaSucesso(true, null, "Usuário deletado com sucesso!")
        );

    } catch (erro) {
        console.error("Erro ao deletar usuário:", erro);
        return res.status(500).json(respostaErro("Erro interno ao deletar usuário"));
    }
}

const emailService = require("../services/emailService");

async function cadastrarUsuarioAdministradorInstituicao(req, res) {
    try {
        const { idInstituicao, cpf, nome, email, senha, receberNoticias } = req.body;

        console.log(req.body);

        await usuarioModel.cadastrarAdministradorInstituicao(idInstituicao, cpf, nome, email, senha, receberNoticias);
        await regraService.inicializarRegrasKpisInstituicao(idInstituicao);

        try {
            await emailService.enviarEmailCadastroConcluido(email, nome);
        } catch (emailErro) {
            console.error("Erro ao enviar email:", emailErro);
        }

        return res.status(200).json(respostaSucesso(true, null, "Usuário registrado com sucesso!"));
    } catch (erro) {
        console.log("ERRO: ", erro)
        if (erro === "EMAIL_EXISTENTE") {
            return res.status(409).json(respostaErro("Não foi possível realizar o cadastro com este email"));
        }

        if (erro === "ADMINISTRADOR_INSTITUICAO_EXISTENTE") {
            return res.status(409).json(respostaErro("Já existe um usuário com cargo de administrador nesta instituição"));
        }

        return res.status(500).json(respostaErro("Erro interno no servidor."));
    }
}

async function cadastrarUsuarioDiretor(req, res) {
    try {
        const { id_instituicao, cpf, nome, email, senha, receberNoticias } = req.body;

        await usuarioModel.cadastrarUsuarioDiretor(id_instituicao, cpf, nome, email, senha, receberNoticias);
	
	try {
	    await emailService.enviaremailCadastroConcluido(email, nome);
	} catch (emailErro) {
	    console.error("Erro ao enviar email:", emailErro);
	}

        return res.status(200).json(respostaSucesso(true, null, "Usuário registrado com sucesso!"));
    } catch (erro) {
        console.error("Erro ao cadastrar usuário: " + erro);

        if (erro === "EMAIL_EXISTENTE") {
            return res.status(409).json(respostaErro("Não foi possível realizar o cadastro com este email"));
        }

        if (erro === "DIRETOR_EXISTENTE") {
            return res.status(409).json(respostaErro("Já existe um usuário com cargo diretor nessa instituição"));
        }

        return res.status(500).json(respostaErro("Erro interno no servidor"));
    }
}

module.exports = {
    cadastrarUsuarioAdministradorInstituicao,
    cadastrarUsuarioDiretor,
    buscarDadosConta,
    atualizarSenha,
    atualizarDados,
    login,
    deletarUsuario
}
