var regraModel = require("../models/regraModel");
var kpiModel = require("../models/kpiModel");

async function inicializarRegrasKpisInstituicao(idInstituicao) {
    const idKpi = await kpiModel.buscarKpiPorNome('risco_evasao_curso');
    
    await regraModel.cadastrarRegra(idInstituicao, idKpi, 'BAIXO', 'Classificação BAIXA para risco no limite entre 0% e 10%', '21C046', 0, 10);
    await regraModel.cadastrarRegra(idInstituicao, idKpi, 'MEDIO', 'Classificação MÉDIA para risco no limite entre 11% e 30%', 'D3C727', 11, 30);
    await regraModel.cadastrarRegra(idInstituicao, idKpi, 'ALTO', 'Classificação BAIXA para risco no limite entre 31% e 100%', 'C42929', 31, 100);
}

module.exports = {
    inicializarRegrasKpisInstituicao
};