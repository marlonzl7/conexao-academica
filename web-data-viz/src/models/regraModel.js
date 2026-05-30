var database = require("../database/config")

async function cadastrarRegra(idInstituicao, idKpi, classificacao, descricao, corHexadecimal, limiteInferior, limiteSuperior) {

    const instrucao = `INSERT INTO regra (id_instituicao, id_kpi, classificacao, descricao, cor_hexadecimal, limite_inferior, limite_superior) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const parametros = [idInstituicao, idKpi, classificacao, descricao, corHexadecimal, limiteInferior, limiteSuperior]

    return database.executar(instrucao, parametros);
}

async function atualizarRegra(idRegra, idKpi, classificacao, descricao, corHexadecimal, limiteInferior, limiteSuperior) {

    const instrucao = `
        UPDATE regra 
        SET 
            id_kpi = ?,
            classificacao = ?, 
            descricao = ?,
            cor_hexadecimal = ?,
            limite_inferior = ?,
            limite_superior = ?
        WHERE id_regra = ?
    `;

    const parametros = [idKpi, classificacao, descricao, corHexadecimal, limiteInferior, limiteSuperior, idRegra]

    return database.executar(instrucao, parametros);
}

async function deletarRegra(idRegra) {

    const instrucao = `DELETE FROM regra
                       WHERE id_regra = ?`;

    const parametros = [idRegra]

    return database.executar(instrucao, parametros);
}

async function listarRegras(idInstituicao) {
    const instrucao = `
        SELECT 
            r.id_regra,
            r.classificacao,
            r.descricao,
            r.cor_hexadecimal,
            r.limite_inferior,
            r.limite_superior,
            r.id_kpi,
            k.nome AS nome_kpi
        FROM regra r
        INNER JOIN kpi k 
            ON r.id_kpi = k.id_kpi
        WHERE r.id_instituicao = ?
    `;
    
    const parametros = [idInstituicao]

    return await database.executar(instrucao, parametros);
}

async function listarRegrasPorInstituicao(idInstituicao) {
    const instrucao = `
        SELECT
            k.nome AS nome_kpi,
            r.classificacao,
            r.cor_hexadecimal,
            r.limite_inferior,
            r.limite_superior
        FROM regra r
        JOIN kpi k ON k.id_kpi = r.id_kpi
        WHERE r.id_instituicao = ?
    `;

    return await database.executar(instrucao, [idInstituicao]);
}

module.exports = {
    cadastrarRegra,
    atualizarRegra,
    deletarRegra,
    listarRegras,
    listarRegrasPorInstituicao
}
