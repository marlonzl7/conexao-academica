var database = require("../database/config");

async function listarKPIs(idCurso) {
    const instrucao = `
        SELECT
            id_instituicao,
            ano_emissao,
            nome_curso AS nome,
            quantidade_matriculas AS matriculas,
            quantidades_desvinculados AS evadidos,
            taxa_evasao,
            risco_evasao
        FROM vw_indic_curso
        WHERE id_curso = ?
        ORDER BY ano_emissao DESC
        LIMIT 1
    `;

    return await database.executar(instrucao, [idCurso]);
}

async function listarKPIsPorPeriodo(idCurso, inicio, fim) {
    const instrucao = `
        SELECT
            id_instituicao,
            MIN(ano_emissao) AS ano_inicio,
            MAX(ano_emissao) AS ano_fim,
            nome_curso AS nome,
            SUM(quantidade_matriculas) AS matriculas,
            SUM(quantidades_desvinculados) AS evadidos,
            ROUND(
                SUM(quantidades_desvinculados) * 100.0 /
                NULLIF(SUM(quantidade_matriculas), 0),
                2
            ) AS taxa_evasao,
            ROUND(
                (
                    (
                        SUM(quantidades_desvinculados) * 100.0 /
                        NULLIF(SUM(quantidade_matriculas), 0)
                    ) * 0.7
                ) +
                (
                    (
                        SUM(quantidade_trancados) * 100.0 /
                        NULLIF(SUM(quantidade_matriculas), 0)
                    ) * 0.3
                ),
                2
            ) AS risco_evasao
        FROM vw_indic_curso
        WHERE id_curso = ?
        AND ano_emissao BETWEEN ? AND ?
        GROUP BY id_instituicao, nome_curso
    `;

    return await database.executar(instrucao, [idCurso, inicio, fim]);
}


async function listarTaxaEvasaoAnual(idCurso) {
    const instrucao = `
        SELECT
            ano_emissao AS ano,
            taxa_evasao
        FROM vw_indic_curso
        WHERE id_curso = ?
        ORDER BY ano_emissao DESC
        LIMIT 5
    `;

    const resultado = await database.executar(instrucao, [idCurso]);

    if (!resultado || resultado.length === 0) {
        return null;
    }

    return resultado.reverse();
}

async function listarTaxaEvasaoAnualPorPeriodo(idCurso, inicio, fim) {
    const instrucao = `
        SELECT
            ano_emissao AS ano,
            taxa_evasao
        FROM vw_indic_curso
        WHERE id_curso = ? 
        AND ano_emissao BETWEEN ? AND ?
        ORDER BY ano_emissao ASC
    `;

    return await database.executar(instrucao, [idCurso, inicio, fim]);
}

async function listarSituacaoAlunos(idCurso) {
    const instrucao = `
        SELECT
            ano_emissao AS ano,
            (
                quantidade_matriculas -
                (
                    quantidades_desvinculados +
                    quantidade_trancados
                )
            ) AS ativos,
            quantidade_trancados AS trancados,
            quantidades_desvinculados AS evadidos
        FROM vw_indic_curso
        WHERE id_curso = ?
        ORDER BY ano_emissao DESC
        LIMIT 5
    `;

    const resultado = await database.executar(instrucao, [idCurso]);

    if (!resultado || resultado.length === 0) {
        return null;
    }

    return resultado.reverse();
}

async function listarSituacaoAlunosPorPeriodo(idCurso, inicio, fim) {
    const instrucao = `
        SELECT
            ano_emissao AS ano,
            (
                quantidade_matriculas -
                (
                    quantidades_desvinculados +
                    quantidade_trancados
                )
            ) AS ativos,
            quantidade_trancados as trancados,
            quantidades_desvinculados as evadidos
        FROM vw_indic_curso
        WHERE id_curso = ? 
        AND ano_emissao BETWEEN ? AND ?
        ORDER BY ano_emissao ASC
    `;

    return await database.executar(instrucao, [idCurso, inicio, fim]);
}

async function listarPeriodos(idCurso) {
    const instrucao = `
        SELECT ano_emissao AS ano
        FROM vw_indic_curso
        WHERE id_curso = ?
        ORDER BY ano_emissao ASC
    `;

    return await database.executar(instrucao, [idCurso]);
}

module.exports = {
    listarKPIs,
    listarKPIsPorPeriodo,
    listarTaxaEvasaoAnual,
    listarTaxaEvasaoAnualPorPeriodo,
    listarSituacaoAlunos,
    listarSituacaoAlunosPorPeriodo,
    listarPeriodos
}