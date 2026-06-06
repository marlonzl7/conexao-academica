var database = require('../database/config');

async function listarAlertas(idInstituicao) {
    const instrucao = `
        SELECT
            a.id_alerta AS id,
            k.nome AS kpi,
            a.classificacao,
            a.condicao,
            a.observacao AS descricao,
            DATE_FORMAT(a.data_hora,'%d/%m/%Y') AS data
        FROM alerta a
        JOIN regra r ON a.id_regra = r.id_regra
        JOIN kpi k ON k.id_kpi = r.id_kpi
        WHERE r.id_instituicao = ?;
    `;
    return await database.executar(instrucao, [idInstituicao]);
}

async function listarRegras(idInstituicao) {
    const instrucao = `
        SELECT
            r.id_regra,
            k.nome AS kpi,
            r.classificacao,
            r.limite_inferior,
            r.limite_superior
        FROM regra r
        JOIN kpi k ON k.id_kpi = r.id_kpi
        WHERE r.id_instituicao = ?;
    `;
    return await database.executar(instrucao, [idInstituicao]);
}

async function listarTodasRegras() {
    const instrucao = `
        SELECT
            r.id_regra,
            r.id_instituicao,
            r.limite_inferior,
            r.limite_superior,
            r.classificacao,
            k.id_kpi,
            k.nome AS kpi,
            i.email AS email_responsavel,
            i.nome AS nome_instituicao
        FROM regra r
        JOIN kpi k ON k.id_kpi = r.id_kpi
        JOIN instituicao i ON i.id_instituicao = r.id_instituicao;
    `;
    return await database.executar(instrucao, []);
}

async function listarKpisDisponiveis(idInstituicao) {
    const instrucao = `
        SELECT DISTINCT k.nome AS kpi
        FROM regra r
        JOIN kpi k ON k.id_kpi = r.id_kpi
        WHERE r.id_instituicao = ?
        ORDER BY k.nome;
    `;
    return await database.executar(instrucao, [idInstituicao]);
}

async function cadastrarAlerta(id_regra, classificacao, observacao, data_hora, condicao) {
    const instrucao = `
        INSERT INTO alerta (id_regra, classificacao, observacao, data_hora, condicao)
        VALUES (?, ?, ?, ?, ?);
    `;
    return await database.executar(instrucao, [id_regra, classificacao, observacao, data_hora, condicao]);
}

async function atualizarAlerta(id_alerta, id_regra, classificacao, observacao, data_hora, condicao) {
    const instrucao = `
        UPDATE alerta
        SET id_regra = ?, classificacao = ?, observacao = ?, data_hora = ?, condicao = ?
        WHERE id_alerta = ?;
    `;
    return await database.executar(instrucao, [id_regra, classificacao, observacao, data_hora, condicao, id_alerta]);
}

async function deletarAlerta(id_alerta) {
    const instrucao = `DELETE FROM alerta WHERE id_alerta = ?;`;
    return await database.executar(instrucao, [id_alerta]);
}

async function buscarKpi(idInstituicao) {
    const instrucao = `
        SELECT
            COUNT(CASE WHEN a.classificacao = 'Crítico' THEN 1 END) AS total_criticos,
            COUNT(CASE WHEN a.classificacao = 'Atenção'  THEN 1 END) AS total_atencao,
            COUNT(a.id_alerta) AS total_alertas
        FROM alerta a
        JOIN regra r ON r.id_regra = a.id_regra
        WHERE r.id_instituicao = ?;
    `;
    return await database.executar(instrucao, [idInstituicao]);
}

async function filtrarAlertas(idInstituicao, classificacao, kpi) {
    const params = [idInstituicao];
    let where = "WHERE r.id_instituicao = ?";

    if (classificacao) {
        where += " AND a.classificacao = ?";
        params.push(classificacao);
    }

    if (kpi) {
        where += " AND k.nome = ?";
        params.push(kpi);
    }

    const instrucao = `
        SELECT
            a.id_alerta AS id,
            k.nome      AS kpi,
            a.classificacao,
            a.condicao,
            a.observacao AS descricao,
            DATE_FORMAT(a.data_hora, '%d/%m/%Y') AS data
        FROM alerta a
        JOIN regra r ON a.id_regra = r.id_regra
        JOIN kpi   k ON k.id_kpi   = r.id_kpi
        ${where};
    `;
    return await database.executar(instrucao, params);
}

async function verificarAlertaExistente(id_regra, condicao) {
    const instrucao = `
        SELECT id_alerta FROM alerta
        WHERE id_regra = ? AND condicao = ?
        LIMIT 1;
    `;
    const resultado = await database.executar(instrucao, [id_regra, condicao]);
    return resultado.length > 0;
}

async function buscarValorAtualKpi(id_kpi, id_instituicao) {
    const instrucao = `
        SELECT valor
        FROM kpi_valor
        WHERE id_kpi = ? AND id_instituicao = ?
        ORDER BY data_referencia DESC
        LIMIT 1;
    `;
    const resultado = await database.executar(instrucao, [id_kpi, id_instituicao]);
    return resultado.length > 0 ? Number(resultado[0].valor) : null;
}

module.exports = {
    listarAlertas,
    listarRegras,
    listarTodasRegras,
    listarKpisDisponiveis,
    cadastrarAlerta,
    atualizarAlerta,
    deletarAlerta,
    buscarKpi,
    filtrarAlertas,
    verificarAlertaExistente,
    buscarValorAtualKpi,
};