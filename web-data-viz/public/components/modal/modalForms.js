// Formularios para os modais

function formDiretor() {

    return `
        <div class="form-group">
            <label>Nome</label>

            <input
                type="text"
                id="diretor_nome"
                placeholder="Ex: Carlos">
        </div>

        <div class="form-group">
            <label>Email</label>

            <input
                type="email"
                id="diretor_email"
                placeholder="Ex: carlos@gmail.com">
        </div>

        <div class="form-group">
            <label>Senha</label>

            <input
                type="password"
                id="diretor_senha">
        </div>
    `;
}

function formAdministrador() {

    return `
        <div class="form-group">
            <label>Nome</label>

            <input
                type="text"
                id="admin_nome">
        </div>

        <div class="form-group">
            <label>Email</label>

            <input
                type="email"
                id="admin_email">
        </div>
    `;
}

function formConfirmacao(mensagem) {

    return `
        <p>${mensagem}</p>
    `;
}