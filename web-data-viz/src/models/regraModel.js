var database = require("../database/config")

async function cadastrarRegra(idInstituicao, idKpi, classificacao, limiteInferior, limiteSuperior) {

    const instrucao = `INSERT INTO regra (id_instituicao, id_kpi, classificacao, limite_inferior, limite_superior) VALUES (?, ?, ?, ?, ?)`;
    const parametros = [idInstituicao, idKpi, classificacao, limiteInferior, limiteSuperior]

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

async function listarRegras(idInstituicao) {
    const instrucao = `SELECT r.id_regra, 
	                   CASE
		                    WHEN r.classificacao = 0 THEN 'Baixo'
                            WHEN r.classificacao = 1 THEN 'Médio'
                            WHEN r.classificacao = 2 THEN 'Alto'
	                    END AS nome_classificacao,
	                    r.limite_inferior, 
                        r.limite_superior, 
                        r.id_kpi, 
                        k.nome AS nome_kpi 
                        FROM regra r
                        INNER JOIN kpi k ON r.id_kpi = k.id_kpi
                        WHERE id_instituicao = ? LIMIT 6;`;
    const parametros = [idInstituicao]

    return await database.executar(instrucao, parametros);
}

module.exports = {
    cadastrarRegra,
    atualizarRegra,
    deletarRegra,
    listarRegras
}
