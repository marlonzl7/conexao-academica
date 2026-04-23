function respostaSucesso(sucesso, dados = null, mensagem = null) {
    return {
        sucesso,
        mensagem,
        dados
    }
}

function respostaErro(mensagem, dados = null) {
    return {
        sucesso: false,
        mensagem,
        dados
    }
}

module.exports = {
    respostaSucesso,
    respostaErro
}