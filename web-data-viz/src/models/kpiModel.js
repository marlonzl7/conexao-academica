var database = require("../database/config");

async function buscarKpi(id_kpi) {

    const instrucao = `SELECT * FROM kpi
                       WHERE id_kpi = ?`;
    const parametros = [id_kpi];

    return database.executar(instrucao, parametros);
}

module.exports = {
    buscarKpi
}
