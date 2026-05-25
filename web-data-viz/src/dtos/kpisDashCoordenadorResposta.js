function resposta(
    periodoInicio,
    periodoFim,
    nome,
    qtdMatriculas,
    qtdEvadidos,
    percTaxaEvasao,
    taxaRiscoEvasao
) {
    return {
        periodo: {
            inicio: periodoInicio,
            fim: periodoFim
        },
        curso: nome,
        kpis: {
            matriculas: qtdMatriculas,
            evadidos: qtdEvadidos,
            taxaEvasao: percTaxaEvasao,
            riscoEvasao: taxaRiscoEvasao
        }
    };
}

module.exports = resposta;