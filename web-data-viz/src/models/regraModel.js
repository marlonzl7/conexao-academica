var database = require("../database/config")

async function cadastrarRegra(idUsuario, idKpi, classificacao, limiteInferior, limiteSuperior) {

    const instrucao = `INSERT INTO regra (id_usuario, id_kpi, classificacao, limite_inferior, limite_superior) VALUES (?, ?, ?, ?, ?)`;
    const parametros = [idUsuario, idKpi, classificacao, limiteInferior, limiteSuperior]

    return database.executar(instrucao, parametros);
}

async function atualizarRegra(idRegra, classificacao, limiteInferior, limiteSuperior) {

    const instrucao = `UPDATE regra 
                       SET classificacao = ?, limite_inferior = ?,
                       limite_superior = ?
                       WHERE id_regra = ?
                        `;
    const parametros = [classificacao, limiteInferior, limiteSuperior, idRegra]

    return database.executar(instrucao, parametros);
}

async function deletarRegra(idRegra) {

    const instrucao = `DELETE FROM regra
                       WHERE id_regra = ?`;
    
    const parametros = [idRegra]

    return database.executar(instrucao, parametros);
}

async function listarRegras(idUsuario) {
    const instrucao = `SELECT id_regra, id_kpi, classificacao, limite_inferior, limite_superior FROM regra
                       WHERE id_usuario = ? LIMIT 6`;
    const parametros = [idUsuario]

    return await database.executar(instrucao, parametros);
}

module.exports = {
    cadastrarRegra,
    atualizarRegra,
    deletarRegra,
    listarRegras
}
