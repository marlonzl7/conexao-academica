var database = require("../database/config")

async function cadastrarRegra(id_regra, id_kpi, classificacao, limite_inferior, limite_superior) {
    const instrucao = `INSERT INTO regra (id_kpi, classificacao, limite_inferior, limite_superior) VALUES (?, ?, ?, ?)`;
    const parametros = [id_regra, id_kpi, classificacao, limite_inferior, limite_superior]

    return database.executar(instrucao, parametros);
}

async function listarRegras() {
    const instrucao = `SELECT classificacao, id_kpi, limite_inferior, limite_superior FROM regra`;
    return await database.executar(instrucao);
}
