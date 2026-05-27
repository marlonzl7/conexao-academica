var dashboardCoordenadorModel = require("../models/dashboardCoordenadorModel");
var regraModel = require("../models/regraModel");

async function listarKPIs({ idCurso, inicio, fim }) {

    let resultadoKPIs;

    if (inicio && fim) {
        resultadoKPIs = 
            await dashboardCoordenadorModel
                .listarKPIsPorPeriodo(
                    idCurso, 
                    inicio, 
                    fim
                );
    } else {
        resultadoKPIs =
            await dashboardCoordenadorModel
                .listarKPIs(idCurso);
    }

    if (!resultadoKPIs || resultadoKPIs.length === 0) {
        return null;
    }

    const kpi = resultadoKPIs[0];

    const idInstituicao = kpi.id_instituicao;

    const regras =
        await regraModel
            .listarRegrasPorInstituicao(idInstituicao);

    const classificacaoTaxaEvasao =
        buscarClassificacao(
            kpi.taxa_evasao,
            regras,
            "taxa_evasao_curso"
        );

    const classificacaoRiscoEvasao =
        buscarClassificacao(
            kpi.risco_evasao,
            regras,
            "risco_evasao_curso"
        );

    return {
        periodo: {
            inicio: Number(inicio || kpi.ano_inicio || kpi.ano_emissao),
            fim: Number(fim || kpi.ano_fim || kpi.ano_emissao)
        },

        curso: {
            nome: kpi.nome
        },

        kpis: {
            matriculas: {
                valor: Number(kpi.matriculas),
                unidade: "alunos"
            },

            evadidos: {
                valor: Number(kpi.evadidos),
                unidade: "alunos"
            },

            taxaEvasao: {
                valor: Number(kpi.taxa_evasao),
                unidade: "%",
                classificacao:
                    classificacaoTaxaEvasao
            },

            riscoEvasao: {
                valor: Number(kpi.risco_evasao),
                unidade: "%",
                classificacao:
                    classificacaoRiscoEvasao
            }
        }
    };
}

async function listarTaxaEvasaoAnual({
    idCurso,
    inicio,
    fim
}) {

    let resultado;

    if (inicio && fim) {
        resultado =
            await dashboardCoordenadorModel
                .listarTaxaEvasaoAnualPorPeriodo(
                    idCurso,
                    inicio,
                    fim
                );
    } else {
        resultado =
            await dashboardCoordenadorModel
                .listarTaxaEvasaoAnual(idCurso);
    }

    if (!resultado || resultado.length === 0) {
        return null;
    }

    return {
        periodo: {
            inicio:
                Number(inicio || resultado[0].ano),

            fim:
                Number(fim || resultado[resultado.length - 1].ano)
        },

        serie: resultado.map(item => ({
            ano: Number(item.ano),
            taxaEvasao: Number(item.taxa_evasao)
        }))
    };
}

async function listarSituacaoAlunos({
    idCurso,
    inicio,
    fim
}) {

    let resultado;

    if (inicio && fim) {
        resultado =
            await dashboardCoordenadorModel
                .listarSituacaoAlunosPorPeriodo(
                    idCurso,
                    inicio,
                    fim
                );
    } else {
        resultado =
            await dashboardCoordenadorModel
                .listarSituacaoAlunos(idCurso);
    }

    if (!resultado || resultado.length === 0) {
        return null;
    }
    
    return {
        periodo: {
            inicio:
                Number(inicio || resultado[0].ano),

            fim:
                Number(fim || resultado[resultado.length - 1].ano)
        },

        serie: resultado.map(item => ({
            ano: Number(item.ano),
            ativos: Number(item.ativos),
            evadidos: Number(item.evadidos),
            trancados: Number(item.trancados)
        }))
    };
}

async function listarPeriodos(idCurso) {
    const resultado =
        await dashboardCoordenadorModel.listarPeriodos(idCurso);

    return {
        anos: resultado
    }
}

function buscarClassificacao(
    valor,
    regras,
    nomeKpi
) {

    const regraEncontrada = regras.find(regra =>
        regra.nome_kpi === nomeKpi &&
        valor >= regra.limite_inferior &&
        valor <= regra.limite_superior
    );

    if (!regraEncontrada) {
        return null;
    }

    return {
        nome: regraEncontrada.classificacao,
        descricao:
            `Entre ${regraEncontrada.limite_inferior}% e ${regraEncontrada.limite_superior}%`,
        cor:
            `#${regraEncontrada.cor_hexadecimal}`
    };
}

module.exports = {
    listarKPIs,
    listarTaxaEvasaoAnual,
    listarSituacaoAlunos,
    listarPeriodos
};