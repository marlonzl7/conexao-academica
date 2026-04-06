const indexModel = require("../models/index.js");
const { respostaSucesso, respostaErro } = require("../dtos/resposta");

async function contact(req, res) {
    try {
        const { nomeServer, emailServer, mensagemServer } = req.body;
        console.log("Dados recebidos:", nomeServer, emailServer, mensagemServer);

        if (!nomeServer || !emailServer || !mensagemServer) {
            return res.status(400).json({ erro: "Dados incompletos" });
        }

        await indexModel.enviarMensagem(nomeServer, emailServer, mensagemServer);
        return res.status(200).json({ mensagem: "Enviado com sucesso!" });

    } catch (erro) {
        console.error("\nERRO NO CONTROLLER:\n", erro);
        return res.status(500).json({ erro: erro.message });
    }
}

module.exports = {
    contact
};