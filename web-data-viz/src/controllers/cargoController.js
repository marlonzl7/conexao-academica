const cargoModel = require("../models/cargoModel.js");

async function getAllRoles(req, res) {
    try {
        const responseFromModel = await cargoModel.getAllRoles();
        return res.status(200).json(responseFromModel);
    } catch (erro) {
        console.error("Erro na controller (getAllRoles):", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

async function deleteRole(req, res) {
    try {
        const roleId = req.params.id;

        if (!roleId) {
            return res.status(400).json({ erro: "ID é obrigatório" });
        }

        await cargoModel.deleteRole(roleId);
        return res.status(204).send(); 
    } catch (erro) {
        console.error("Erro na controller (deleteRole):", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

async function updateRole(req, res) {
    try {
        const roleId = req.params.id;
        const { nome } = req.body;

        if (!roleId || !nome) {
            return res.status(400).json({ erro: "ID e nome são obrigatórios" });
        }

        const responseFromModel = await cargoModel.updateRole(roleId, nome);
        return res.status(200).json(responseFromModel);

    } catch (erro) {
        console.error("Erro na controller (updateRole):", erro);
        return res.status(500).json({ erro: erro.message });
    }
}


async function createRole(req, res) {
    try {
        const { nome } = req.body;

        if (!nome) {
            return res.status(400).json({ erro: "Nome é obrigatório" });
        }

        const response = await cargoModel.createRole(nome);
        return res.status(201).json(response);

    } catch (erro) {
        console.error("Erro na controller (createRole):", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

module.exports = {
    getAllRoles,
    deleteRole,
    updateRole,
    createRole
};