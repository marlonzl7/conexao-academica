var database = require("../database/config");

async function obterIdPorNome(nome) {
    const instrucao = `SELECT id_cargo FROM cargo WHERE nome = ?`;
    return await database.executar(instrucao, [nome]);
}

module.exports = {
    obterIdPorNome
};