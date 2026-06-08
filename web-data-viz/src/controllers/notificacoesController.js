const model = require("../models/notificacoesModel");

const KPI_LABELS = {
  taxa_evasao_instituicao: "Taxa de Evasão (Instituição)",
  taxa_evasao_curso: "Taxa de Evasão (Curso)",
  risco_evasao_curso: "Risco de Evasão (Curso)",
  matriculas_curso: "Total de Matrículas",
  evadidos_curso: "Alunos Evadidos",
  evadidos_presencial: "Evasão Presencial",
  evadidos_ead: "Evasão EaD",
};

async function processarAlertas(alertasConfigurados, valoresKpi) {
  for (const alerta of alertasConfigurados) {
    const leituras = valoresKpi[alerta.nome_kpi] || [];

    for (const { valor, contexto } of leituras) {
      let condicaoDisparada = null;

      if (valor > Number(alerta.limite_superior)) {
        condicaoDisparada = "Superior";
      }

      else if (valor < Number(alerta.limite_inferior)) {
        condicaoDisparada = "Inferior";
      }

      if (!condicaoDisparada || condicaoDisparada !== alerta.condicao_configurada) continue;

      const jaDisparou = await model.disparoRecenteExiste(
        alerta.id_alerta,
        contexto,
      );
      if (!jaDisparou) {
        await model.gravarDisparo(
          alerta.id_alerta,
          valor,
          condicaoDisparada,
          contexto,
        );
      }
    }
  }
}

function formatarDisparos(disparos) {
  return disparos.map((d) => ({
    id: d.id_disparo,
    kpi: KPI_LABELS[d.nome_kpi] ?? d.nome_kpi,
    classificacao: d.classificacao,
    descricao: d.observacao,
    condicao: d.condicao,
    valorAtual: d.valor_atual,
    limiteInferior: d.limite_inferior,
    limiteSuperior: d.limite_superior,
    contexto: d.contexto,
    data: d.data_hora,
  }));
}

function montarValoresKpi(entries) {
  const mapa = {};
  function add(nome, valor, contexto) {
    if (valor === null || valor === undefined || isNaN(Number(valor))) return;
    if (!mapa[nome]) mapa[nome] = [];
    mapa[nome].push({ valor: Number(valor), contexto });
  }
  entries(add);
  return mapa;
}

async function verificarDiretor(req, res) {
  try {
    const { idInstituicao } = req.params;

    const alertas = await model.listarAlertasConfigurados(idInstituicao);
    if (!alertas.length) return res.json([]);

    const kpisInst = await model.buscarKpisInstituicao(idInstituicao);
    const kpisCurso = await model.buscarKpisCursos(idInstituicao);

    const valoresKpi = montarValoresKpi((add) => {
      if (kpisInst) {
        add(
          "taxa_evasao_instituicao",
          kpisInst.taxa_evasao_instituicao,
          "Instituição",
        );
        add(
          "evadidos_presencial",
          kpisInst.evadidos_presencial,
          "Modalidade Presencial",
        );
        add("evadidos_ead", kpisInst.evadidos_ead, "Modalidade EaD");
      }

      for (const curso of kpisCurso) {
        const ctx = `Curso: ${curso.nome_curso}`;
        add("taxa_evasao_curso", curso.taxa_evasao_curso, ctx);
        add("risco_evasao_curso", curso.risco_evasao_curso, ctx);
        add("matriculas_curso", curso.matriculas_curso, ctx);
        add("evadidos_curso", curso.evadidos_curso, ctx);
      }
    });

    await processarAlertas(alertas, valoresKpi);

    const disparos = await model.listarDisparosDiretor(idInstituicao);
    return res.json(formatarDisparos(disparos));
  } catch (erro) {
    console.error("[Notificações Diretor] Erro:", erro);
    return res
      .status(500)
      .json({ erro: "Erro interno ao verificar notificações." });
  }
}

async function verificarCoordenador(req, res) {
  try {
    const { idInstituicao, idCurso } = req.params;

    const alertas = await model.listarAlertasConfigurados(idInstituicao);
    if (!alertas.length) return res.json([]);

    const cursos = await model.buscarKpisCurso(idInstituicao, idCurso);

    const valoresKpi = montarValoresKpi((add) => {
      for (const curso of cursos) {
        const ctx = `Curso: ${curso.nome_curso}`;
        add("taxa_evasao_curso", curso.taxa_evasao_curso, ctx);
        add("risco_evasao_curso", curso.risco_evasao_curso, ctx);
        add("matriculas_curso", curso.matriculas_curso, ctx);
        add("evadidos_curso", curso.evadidos_curso, ctx);
      }
    });

    await processarAlertas(alertas, valoresKpi);

    const disparos = await model.listarDisparosCoordenador(
      idInstituicao,
      idCurso,
    );
    return res.json(formatarDisparos(disparos));
  } catch (erro) {
    console.error("[Notificações Coordenador] Erro:", erro);
    return res
      .status(500)
      .json({ erro: "Erro interno ao verificar notificações." });
  }
}

async function verificarAdminInstituicao(req, res) {
  try {
    const { idInstituicao } = req.params;

    const alertas = await model.listarAlertasConfigurados(idInstituicao);
    if (!alertas.length) return res.json([]);

    const kpisInst = await model.buscarKpisInstituicao(idInstituicao);
    const kpisCurso = await model.buscarKpisCursos(idInstituicao);

    const valoresKpi = montarValoresKpi((add) => {

      if (kpisInst) {
        add(
          "taxa_evasao_instituicao",
          kpisInst.taxa_evasao_instituicao,
          "Instituição",
        );
        add(
          "evadidos_presencial",
          kpisInst.evadidos_presencial,
          "Modalidade Presencial",
        );
        add("evadidos_ead", kpisInst.evadidos_ead, "Modalidade EaD");
      }

      for (const curso of kpisCurso) {
        const ctx = `Curso: ${curso.nome_curso}`;
        add("taxa_evasao_curso", curso.taxa_evasao_curso, ctx);
        add("risco_evasao_curso", curso.risco_evasao_curso, ctx);
        add("matriculas_curso", curso.matriculas_curso, ctx);
        add("evadidos_curso", curso.evadidos_curso, ctx);
      }
    });

    await processarAlertas(alertas, valoresKpi);

    const disparos = await model.listarDisparosTodos(idInstituicao);
    return res.json(formatarDisparos(disparos));
  } catch (erro) {
    console.error("[Notificações Admin] Erro:", erro);
    return res
      .status(500)
      .json({ erro: "Erro interno ao verificar notificações." });
  }
}

module.exports = {
  verificarDiretor,
  verificarCoordenador,
  verificarAdminInstituicao,
};