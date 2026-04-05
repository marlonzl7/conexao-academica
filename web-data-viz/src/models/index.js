var database = require("../database");

function enviarMensagem(nome, email, mensagem) {
    const instrucao = `
        INSERT INTO mensagem (nome, email, mensagem) VALUES (?, ?, ?);
    `;
    return database.executar(instrucao, [nome, email, mensagem]);
}

module.exports = {
    enviarMensagem
};