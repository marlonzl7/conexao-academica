var database = require("../database/config");

async function listar() {
    const instrucao = `SELECT id_instituicao, nome FROM instituicao`;
    return await database.executar(instrucao);
}

async function buscar(busca) {
    const instrucao = `SELECT id_instituicao, nome FROM instituicao WHERE nome LIKE ?`;
    const parametro = "%" + busca + "%";
    return await database.executar(instrucao, parametro);
}

module.exports = {
    listar,
    buscar
};