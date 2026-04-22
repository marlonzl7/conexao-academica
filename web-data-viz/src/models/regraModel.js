var database = require("../database/config")

async function cadastrarRegra(id_regra, id_kpi, classificacao, limite_inferior, limite_superior) {

    const instrucao = `INSERT INTO regra (id_kpi, classificacao, limite_inferior, limite_superior) VALUES (?, ?, ?, ?)`;
    const parametros = [id_regra, id_kpi, classificacao, limite_inferior, limite_superior]

    return database.executar(instrucao, parametros);
}

async function atualizarRegra(id_regra, classificacao, limite_inferior, limite_superior) {

    const instrucao = `UPDATE regra 
                       SET classificacao = ?, limite_inferior = ?
                       limite_superior = ?
                       WHERE id_regra = ?
                        `;
    const parametros = [id_regra, classificacao, limite_inferior, limite_superior]

    return database.executar(instrucao, parametros);
}

async function listarRegras() {
    const instrucao = `SELECT id_kpi, classificacao, limite_inferior, limite_superior FROM regra`;
    return await database.executar(instrucao);
}

module.exports = {
    cadastrarRegra,
    listarRegras
}
