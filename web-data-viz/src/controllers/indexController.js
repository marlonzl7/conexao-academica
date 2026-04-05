const indexModel = require("../models/indexModel");
const { respostaSucesso, respostaErro } = require("../dtos/resposta");

async function enviarMensagem(req, res) {
    try {
        const { nomeServer, emailServer, mensagemServer } = req.body;
        await indexModel.enviarMensagem(nomeServer, emailServer, mensagemServer);
        return res.status(200).json(respostaSucesso(true, null, "Mensagem enviada com sucesso"));
    } catch (erro) {
        console.log("Não foi possível enviar a mensagem: " + erro);
        return res.status(500).json(respostaErro("Erro interno no servidor"));
    }
}

module.exports = {
    enviarMensagem
};