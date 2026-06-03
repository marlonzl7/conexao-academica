var database = require('../database/config');

async function listarRegras(idInstituicao) {
    const instrucao = `
        SELECT
        r.id_regra,
        k.nome AS kpi,
        r.classificacao,
        r.limite_inferior,
        r.limite_superior
    FROM regra r
        JOIN kpi k ON k.id_kpi = r.id_kpi WHERE r.id_instituicao = ?;
    `;

    return await database.executar(instrucao, [idInstituicao]);
}

module.exports = {
    listarRegras
};