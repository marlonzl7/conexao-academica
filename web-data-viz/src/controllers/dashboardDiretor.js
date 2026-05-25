const dashboardDiretorModel = require("../models/dashboardDiretor");

async function getKPIs(req, res) {
    try{
        const responseFromModel = await dashboardDiretorModel.getKPIs();
        return res.status(200).json(responseFromModel);
    } catch (erro) {
        console.error("Erro na controller (getKPIs):", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

module.exports = {
    getKPIs
};