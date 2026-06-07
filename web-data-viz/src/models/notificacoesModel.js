var database = require("../database/config");

async function listarAlertasConfigurados(idInstituicao) {
  const instrucao = `
        SELECT
            a.id_alerta,
            a.classificacao,
            a.observacao,
            a.condicao AS condicao_configurada,
            r.id_regra,
            r.limite_inferior,
            r.limite_superior,
            r.descricao AS descricao_regra,
            r.cor_hexadecimal,
            k.nome AS nome_kpi
        FROM alerta a
        JOIN regra r ON r.id_regra = a.id_regra
        JOIN kpi k ON k.id_kpi = r.id_kpi
        WHERE r.id_instituicao = ?
    `;
  return await database.executar(instrucao, [idInstituicao]);
}

async function buscarKpisInstituicao(idInstituicao) {
  const instrucao = `
        SELECT
            ROUND(AVG(taxa_evasao), 2) AS taxa_evasao_instituicao,
            ROUND(AVG(evadidos_presencial), 2) AS evadidos_presencial,
            ROUND(AVG(evadidos_ead), 2) AS evadidos_ead
        FROM vw_indic_geral
        WHERE id_instituicao = ?
          AND ano_emissao = (
              SELECT MAX(ano_emissao) FROM vw_indic_geral WHERE id_instituicao = ?
          )
    `;
  const rows = await database.executar(instrucao, [
    idInstituicao,
    idInstituicao,
  ]);
  return rows[0] ?? null;
}

async function buscarKpisCursos(idInstituicao) {
  const instrucao = `
        SELECT
            id_curso,
            nome_curso,
            ROUND(AVG(taxa_evasao), 2) AS taxa_evasao_curso,
            ROUND(AVG(risco_evasao), 2) AS risco_evasao_curso,
            SUM(quantidade_matriculas) AS matriculas_curso,
            SUM(quantidades_desvinculados) AS evadidos_curso
        FROM vw_indic_curso
        WHERE id_instituicao = ?
          AND ano_emissao = (
              SELECT MAX(ano_emissao) FROM vw_indic_curso WHERE id_instituicao = ?
          )
        GROUP BY id_curso, nome_curso
    `;
  return await database.executar(instrucao, [idInstituicao, idInstituicao]);
}


async function buscarKpisCurso(idInstituicao, idCurso) {
  const instrucao = `
        SELECT
            id_curso,
            nome_curso,
            ROUND(AVG(taxa_evasao), 2) AS taxa_evasao_curso,
            ROUND(AVG(risco_evasao), 2) AS risco_evasao_curso,
            SUM(quantidade_matriculas) AS matriculas_curso,
            SUM(quantidades_desvinculados) AS evadidos_curso
        FROM vw_indic_curso
        WHERE id_instituicao = ?
          AND id_curso = ?
          AND ano_emissao = (
              SELECT MAX(ano_emissao) FROM vw_indic_curso
              WHERE id_instituicao = ? AND id_curso = ?
          )
        GROUP BY id_curso, nome_curso
    `;
  return await database.executar(instrucao, [
    idInstituicao,
    idCurso,
    idInstituicao,
    idCurso,
  ]);
}

async function gravarDisparo(idAlerta, valorAtual, condicao, contexto) {
  const dataHora = new Date().toISOString().slice(0, 19).replace("T", " ");
  const instrucao = `
        INSERT INTO alerta_disparo (id_alerta, valor_atual, condicao, contexto, data_hora)
        VALUES (?, ?, ?, ?, ?)
    `;
  return await database.executar(instrucao, [
    idAlerta,
    valorAtual,
    condicao,
    contexto,
    dataHora,
  ]);
}

async function disparoRecenteExiste(idAlerta, contexto) {
  const instrucao = `
        SELECT id_disparo FROM alerta_disparo
        WHERE id_alerta = ?
          AND contexto  = ?
          AND data_hora >= NOW() - INTERVAL 24 HOUR
        LIMIT 1
    `;
  const rows = await database.executar(instrucao, [idAlerta, contexto]);
  return rows.length > 0;
}

async function listarDisparosDiretor(idInstituicao) {
  const instrucao = `
        SELECT
            d.id_disparo,
            d.id_alerta,
            d.valor_atual,
            d.condicao,
            d.contexto,
            DATE_FORMAT(d.data_hora, '%d/%m/%Y %H:%i') AS data_hora,
            a.classificacao,
            a.observacao,
            k.nome AS nome_kpi,
            r.limite_inferior,
            r.limite_superior,
            r.cor_hexadecimal
        FROM alerta_disparo d
        JOIN alerta a ON a.id_alerta = d.id_alerta
        JOIN regra r ON r.id_regra  = a.id_regra
        JOIN kpi k ON k.id_kpi    = r.id_kpi
        WHERE r.id_instituicao = ?
          AND d.contexto NOT LIKE 'Curso:%'
        ORDER BY d.data_hora DESC
        LIMIT 100
    `;
  return await database.executar(instrucao, [idInstituicao]);
}

async function listarDisparosCoordenador(idInstituicao, idCurso) {
  const nomeCursoRows = await database.executar(
    `SELECT nome FROM curso WHERE id_curso = ? LIMIT 1`,
    [idCurso],
  );
  if (!nomeCursoRows.length) return [];
  const nomeCurso = nomeCursoRows[0].nome;

  const instrucao = `
        SELECT
            d.id_disparo,
            d.id_alerta,
            d.valor_atual,
            d.condicao,
            d.contexto,
            DATE_FORMAT(d.data_hora, '%d/%m/%Y %H:%i') AS data_hora,
            a.classificacao,
            a.observacao,
            k.nome          AS nome_kpi,
            r.limite_inferior,
            r.limite_superior,
            r.cor_hexadecimal
        FROM alerta_disparo d
        JOIN alerta a ON a.id_alerta = d.id_alerta
        JOIN regra r ON r.id_regra = a.id_regra
        JOIN kpi k ON k.id_kpi = r.id_kpi
        WHERE r.id_instituicao = ?
          AND d.contexto = ?
        ORDER BY d.data_hora DESC
        LIMIT 100
    `;
  return await database.executar(instrucao, [
    idInstituicao,
    `Curso: ${nomeCurso}`,
  ]);
}

async function listarDisparosTodos(idInstituicao) {
  const instrucao = `
        SELECT
            d.id_disparo,
            d.id_alerta,
            d.valor_atual,
            d.condicao,
            d.contexto,
            DATE_FORMAT(d.data_hora, '%d/%m/%Y %H:%i') AS data_hora,
            a.classificacao,
            a.observacao,
            k.nome AS nome_kpi,
            r.limite_inferior,
            r.limite_superior,
            r.cor_hexadecimal
        FROM alerta_disparo d
        JOIN alerta a ON a.id_alerta = d.id_alerta
        JOIN regra r ON r.id_regra = a.id_regra
        JOIN kpi k ON k.id_kpi = r.id_kpi
        WHERE r.id_instituicao = ?
        ORDER BY d.data_hora DESC
        LIMIT 100
    `;
  return await database.executar(instrucao, [idInstituicao]);
}

module.exports = {
  listarAlertasConfigurados,
  buscarKpisInstituicao,
  buscarKpisCursos,
  buscarKpisCurso,
  gravarDisparo,
  disparoRecenteExiste,
  listarDisparosDiretor,
  listarDisparosCoordenador,
  listarDisparosTodos,
};
