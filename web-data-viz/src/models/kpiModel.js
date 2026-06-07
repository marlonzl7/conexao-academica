var database = require("../database/config");

async function listarKpis() {
    const instrucao = `SELECT * FROM kpi`
    
    return await database.executar(instrucao);
}

async function buscarKpi(id_kpi) {

    const instrucao = `SELECT * FROM kpi
                       WHERE id_kpi = ?`;
    const parametros = [id_kpi];

    return await database.executar(instrucao, parametros);
}

async function buscarKpiPorNome(nome) {
    const instrucao = `SELECT id_kpi FROM kpi WHERE nome = ?`;
    const resultado = await database.executar(instrucao, [nome]);
    
    return resultado[0].id_kpi;
}

module.exports = {
    listarKpis,
    buscarKpi,
    buscarKpiPorNome
}
