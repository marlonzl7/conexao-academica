var database = require("../database/config");

async function obterIdPorNome(nome) {
    const instrucao = `
        SELECT id_cargo 
        FROM cargo 
        WHERE nome = ?
        LIMIT 1
    `;
    
    const resultado = await database.executar(instrucao, [nome]);

    if (!resultado || resultado.length === 0) {
        throw "CARGO_NAO_ENCONTRADO";
    }

    return resultado[0].id_cargo;
}

async function getAllRoles() {
    const query = "SELECT * FROM cargo";
    return await database.executar(query);
}


async function deleteRole(id) {
    const query = "DELETE FROM cargo where id_cargo = ?"
    return await database.executar(query, [id]);
}

async function updateRole(id, nome) {
    const query = "UPDATE cargo set nome = ? where id_cargo = ?"
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
