const cargoModel = require("../models/cargoModel.js");
const { respostaSucesso, respostaErro } = require("../dtos/resposta.js");

async function getAllRoles(req, res) {
    try {
        const responseFromModel = await cargoModel.getAllRoles();
        return res.status(200).json(respostaSucesso(true, responseFromModel));
    } catch (erro) {
        console.error("Erro na controller (getAllRoles):", erro);
        return res.status(500).json(respostaErro("Erro ao listar cargos"));
    }
}

async function deleteRole(req, res) {
    try {
        const roleId = req.params.id;

        if (!roleId) {
            return res.status(400).json(respostaErro("ID é obrigatório"));
        }

        await cargoModel.deleteRole(roleId);
        return res.status(204).send(); 
    } catch (erro) {
        console.error("Erro na controller (deleteRole):", erro);
        return res.status(500).json(respostaErro("Erro ao excluir cargo"));
    }
}

async function updateRole(req, res) {
    try {
        const roleId = req.params.id;
        const { nome } = req.body;

        if (!roleId) {
            return res.status(400).json(
                respostaErro("ID é obrigatório")
            );
        }

        if (!nome || nome.trim().length < 3) {
            return res.status(400).json(
                respostaErro("O cargo deve possuir no mínimo 3 letras")
            );
        }

        if (nome.trim().length > 50) {
            return res.status(400).json(
                respostaErro("O cargo deve possuir no máximo 50 caracteres")
            );
        }

        const responseFromModel = await cargoModel.updateRole(
            roleId,
            nome.trim()
        );

        return res.status(200).json(
            respostaSucesso(true, responseFromModel)
        );

    } catch (erro) {
        console.error("Erro na controller (updateRole):", erro);

        return res.status(500).json(
            respostaErro("Erro ao atualizar cargo")
        );
    }
}


async function createRole(req, res) {
    try {
        const { nome } = req.body;

        if (!nome || nome.trim().length < 3) {
            return res.status(400).json(
                respostaErro("O cargo deve possuir no mínimo 3 letras")
            );
        }

        if (nome.trim().length > 50) {
            return res.status(400).json(
                respostaErro("O cargo deve possuir no máximo 50 caracteres")
            );
        }

        const response = await cargoModel.createRole(nome.trim());

        return res.status(201).json(
            respostaSucesso(true, response)
        );

    } catch (erro) {
        console.error("Erro na controller (createRole):", erro);

        return res.status(500).json(
            respostaErro("Erro ao criar cargo")
        );
    }
}

module.exports = {
    getAllRoles,
    deleteRole,
    updateRole,
    createRole
};