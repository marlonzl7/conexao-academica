const administradorModel = require("../models/administrador.js");
const { respostaSucesso, respostaErro } = require("../dtos/resposta.js");

async function listar(req, res) {
    try {
        const resultado = await administradorModel.buscarInstituicoes();

        if (!resultado || resultado.length === 0) {
            return res.status(200).send({sucesso: true, dados: []});
        }

        res.status(200).json({
            sucesso: true,
            dados: resultado
        })

    } catch (erro) {
        console.error("Erro no controller:", erro);
        res.status(500).json({
            erro: "Erro ao buscar instituições"
        });
    }
    
}

module.exports = {
    listar
};
