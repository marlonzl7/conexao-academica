var database = require("../database/config");

async function getKPIs() {
    var instrucao = `
        SELECT 
            total_matriculas AS totalMatriculas, 
            total_desvinculados AS alunosEvadidos, 
            taxa_evasao AS taxaEvasao, 
            evadidos_presencial AS evadidosPresencial, 
            evadidos_ead AS evadidosEAD
        FROM vw_indic_geral;
    `;

    return await database.executar(instrucao);
}

module.exports = {
    getKPIs
};