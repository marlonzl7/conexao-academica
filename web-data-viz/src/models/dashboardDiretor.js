var database = require("../database/config");

async function getKPIs(anoInicio, anoFim, idInstituicao) {
    var instrucao = `
        SELECT 
            SUM(total_matriculas) AS totalMatriculas,
            SUM(total_desvinculados) AS alunosEvadidos,
            ROUND(SUM(total_desvinculados) * 100.0 / NULLIF(SUM(total_matriculas), 0), 2) AS taxaEvasao,
            ROUND(SUM(total_presencial) * 100.0 / NULLIF(SUM(total_desvinculados), 0), 2) AS evadidosPresencial,
            ROUND(SUM(total_ead) * 100.0 / NULLIF(SUM(total_desvinculados), 0), 2) AS evadidosEAD
        FROM vw_indic_geral 
        WHERE ano_emissao BETWEEN ? AND ? AND id_instituicao = ?;
    `;

    return await database.executar(instrucao, [anoInicio, anoFim, idInstituicao]);
}

async function getAnosDisponiveis(idInstituicao) {
    var instrucao = `
        SELECT DISTINCT ano_emissao AS ano
            FROM vw_indic_geral
            WHERE id_instituicao = ?
        ORDER BY ano_emissao;
    `;

    return await database.executar(instrucao, [idInstituicao]);
}

async function getGraficoEvasao(anoInicio, anoFim, idInstituicao) {
    var instrucao = `
        SELECT 
            id_instituicao AS idInstituicao,
            nome_curso AS nomeCurso,
            nome_instituicao AS nomeInstituicao,
            ano_emissao AS anoEmissao,
            quantidades_desvinculados AS qtdDesvinculados
        FROM vw_indic_curso
            WHERE ano_emissao BETWEEN ? AND ?
            AND id_instituicao = ?
        ORDER BY ano_emissao ASC, quantidades_desvinculados DESC;
    `;

    return await database.executar(instrucao, [anoInicio, anoFim, idInstituicao]);
}

async function getGraficoResumoEvasao(anoInicio, anoFim, idInstituicao) {
    var instrucao = `
    SELECT 
        SUM(quantidade_matriculas) AS totalMatriculas,
        SUM(quantidades_desvinculados) AS qtdDesvinculados,
        SUM(quantidade_trancados) AS qtdTrancados,
        id_instituicao AS idInstituicao,
        ano_emissao AS anoEmissao
    FROM vw_indic_curso 
        WHERE ano_emissao BETWEEN ? AND ? AND id_instituicao = ?
    GROUP BY ano_emissao, id_instituicao ORDER BY ano_emissao ASC;
    `;

    return await database.executar(instrucao, [anoInicio, anoFim, idInstituicao]);
}


module.exports = {
    getKPIs,
    getAnosDisponiveis,
    getGraficoEvasao,
    getGraficoResumoEvasao
};