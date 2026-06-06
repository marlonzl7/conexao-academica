var dashboardDiretorModel = require("../models/dashboardDiretor");
var regraModel = require("../models/regraModel");

async function getKPIs(anoInicio, anoFim, idInstituicao) {
    const resultadoKPIs = await dashboardDiretorModel.getKPIs(anoInicio, anoFim, idInstituicao);

    if (!resultadoKPIs || resultadoKPIs.length === 0) {
        return null;
    }

    const kpi = resultadoKPIs[0];

    const regras = await regraModel.listarRegrasPorInstituicao(idInstituicao);

    const classificacaoMatriculas = buscarClassificacao(
        kpi.totalMatriculas,
        regras,
        "matriculas_instituicao"
    );

    const classificacaoEvadidos = buscarClassificacao(
        kpi.alunosEvadidos,
        regras,
        "evadidos_instituicao"
    );

    const classificacaoTaxaEvasao = buscarClassificacao(
        kpi.taxaEvasao,
        regras,
        "taxa_evasao_instituicao"
    );

    // KPI de diferença presencial/EAD: usa o maior dos dois como valor de comparação
    const diferencaPresencialEAD = Math.abs(
        Number(kpi.evadidosPresencial || 0) - Number(kpi.evadidosEAD || 0)
    );

    const classificacaoPresencialEAD = buscarClassificacao(
        diferencaPresencialEAD,
        regras,
        "taxa_presencial_ead"
    );

    return {
        kpis: {
            matriculas: {
                valor: Number(kpi.totalMatriculas ?? 0),
                classificacao: classificacaoMatriculas
            },
            evadidos: {
                valor: Number(kpi.alunosEvadidos ?? 0),
                classificacao: classificacaoEvadidos
            },
            taxaEvasao: {
                valor: Number(kpi.taxaEvasao || 0),
                classificacao: classificacaoTaxaEvasao
            },
            evasaoPresencialEAD: {
                presencial: Number(kpi.evadidosPresencial || 0),
                ead: Number(kpi.evadidosEAD || 0),
                classificacao: classificacaoPresencialEAD
            }
        }
    };
}

async function getAnosDisponiveis(idInstituicao) {
    const resultado = await dashboardDiretorModel.getAnosDisponiveis(idInstituicao);
    return { anos: resultado };
}

async function getGraficoEvasao(anoInicio, anoFim, idInstituicao) {
    return await dashboardDiretorModel.getGraficoEvasao(anoInicio, anoFim, idInstituicao);
}

async function getTaxaEvasaoAnual(anoInicio, anoFim, idInstituicao) {
    const resultado = await dashboardDiretorModel.getGraficoResumoEvasao(anoInicio, anoFim, idInstituicao);

    if (!resultado || resultado.length === 0) return null;

    return {
        serie: resultado.map(item => ({
            ano: Number(item.anoEmissao),
            matriculas: Number(item.totalMatriculas),
            evadidos: Number(item.qtdDesvinculados),
            trancados: Number(item.qtdTrancados)
        }))
    };
}

function buscarClassificacao(valor, regras, nomeKpi) {
    console.log("Buscando classificação para:", nomeKpi, "valor:", valor, typeof valor);
    
    const regrasFiltradas = regras.filter(r => r.nome_kpi === nomeKpi);
    console.log("Regras encontradas para o KPI:", regrasFiltradas);

    const regraEncontrada = regras.find(regra =>
        regra.nome_kpi === nomeKpi &&
        Number(valor) >= Number(regra.limite_inferior) &&
        Number(valor) <= Number(regra.limite_superior)
    );
    
    console.log("Regra encontrada:", regraEncontrada);

    if (!regraEncontrada) return null;

    return {
        nome: regraEncontrada.classificacao,
        descricao: `Entre ${regraEncontrada.limite_inferior} e ${regraEncontrada.limite_superior}`,
        cor: `#${regraEncontrada.cor_hexadecimal}`
    };
}

module.exports = {
    getKPIs,
    getAnosDisponiveis,
    getGraficoEvasao,
    getTaxaEvasaoAnual
};