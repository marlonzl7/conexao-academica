const indexModel = require("../models/index.js");
const { respostaSucesso, respostaErro } = require("../dtos/resposta");

async function contact(req, res) {
    try {
        const { name, email, message } = req.body;
        console.log("Dados recebidos:", name, email, message);

        if (!name || !email || !message) {
            return res.status(400).json(respostaErro("Dados incompletos"));
        }

        await indexModel.enviarMensagem(name, email, message);
        return res.status(200).json(respostaSucesso(true, "Mensagem enviada com sucesso"));

    } catch (erro) {
        console.error("\nERRO NO CONTROLLER:\n", erro);
        return res.status(500).json(respostaErro("Erro ao enviar mensagem"));
    }
}

module.exports = {
    contact
};
