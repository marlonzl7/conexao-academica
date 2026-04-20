var database = require("../database/config");

async function obterIdPorNome(nome) {
    const instrucao = `SELECT id_cargo FROM cargo WHERE nome = ?`;
    return await database.executar(instrucao, [nome]);
}

async function getAllRoles() {
    const query = "SELECT * FROM cargo";
    return await database.executar(query);
}


async function deleteRole(id) {
    const query = "DELETE FROM CARGO where id_cargo = ?"
    return await database.executar(query, [id]);
}

async function updateRole(id, nome) {
    const query = "UPDATE FROM cargo set nome = ? where id = ?"
    return await database.executar(query, [nome, id])
}

async function createRole(nome) {
    const query = "INSERT INTO cargo (nome) VALUES (?)";
    return await database.executar(query, [nome]);
}


module.exports = {
    obterIdPorNome,
    getAllRoles,
    deleteRole,
    updateRole,
    createRole

};