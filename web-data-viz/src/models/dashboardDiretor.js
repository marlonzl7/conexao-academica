var database = require("../database/config");

async function getKPIs(anoInicio, anoFim, idInstituicao) {
    var instrucao = `
    SELECT 
        SUM(total_matriculas) AS totalMatriculas, 
        SUM(total_desvinculados) AS alunosEvadidos, 
        ROUND(AVG(taxa_evasao), 2) AS taxaEvasao, -- Corrigido para calcular a média real do período
        ROUND(AVG(evadidos_presencial), 2) AS evadidosPresencial, 
        ROUND(AVG(evadidos_ead), 2) AS evadidosEAD
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
            ano_emissao AS anoEmissao,
            quantidades_desvinculados AS qtdDesvinculados
        FROM vw_indic_curso
            WHERE ano_emissao BETWEEN ? AND ?
            AND id_instituicao = ?
        ORDER BY ano_emissao ASC, quantidades_desvinculados DESC;
    `;

    return await database.executar(instrucao, [anoInicio, anoFim, idInstituicao]);
}

module.exports = {
    getKPIs,
    getAnosDisponiveis,
    getGraficoEvasao
};