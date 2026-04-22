const provedorSMTP = require("./provedorSMTP");

async function enviarEmailCadastroConcluido(email, nome) {
    await provedorSMTP.enviar({
        para: email,
        assunto: "Cadastro recebido - Conexão Acadêmica",
        html: `
            <h2>Olá, ${nome}!</h2>
         <p>Recebemos seu cadastro e nossa equipe de suporte entrará em contato nos próximos dias para validar suas informações.</p>
<p>A verificação é feita com base no CPF fornecido para confirmar que você possui o cargo de diretor na instituição indicada.</p>
<p>Após a análise, você receberá um retorno independentemente do resultado — seja aprovação ou não.</p>
<p>Em caso de dúvidas, estamos à disposição para ajudá-lo.</p>
<br>
<p>Atenciosamente,<br><strong>Equipe Conexão Acadêmica</strong></p>
        `
    });
}

module.exports = { enviarEmailCadastroConcluido };