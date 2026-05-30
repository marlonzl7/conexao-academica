function formDiretor() {

    return `
        <div class="form-group">
            <label>Nome</label>

            <input
                type="text"
                id="diretor_nome"
                placeholder="Digite o nome do diretor">
        </div>

        <div class="form-group">
            <label>CPF</label>

            <input
                type="text"
                id="diretor_cpf"
                placeholder="Digite o CPF do diretor">
        </div>

        <div class="form-group">
            <label>Email</label>

            <input
                type="email"
                id="diretor_email"
                placeholder="Digite o email do diretor">
        </div>

        <div class="form-group">
            <label>Senha</label>

            <input
                type="password"
                id="diretor_senha"
                placeholder="Digite a senha do diretor">
        </div>
    `;
}

function formCoordenador() {

    return `
        <div class="form-group">
            <label>Nome</label>

            <input
                type="text"
                id="coordenador_nome"
                placeholder="Digite o nome do coordenador">
        </div>

        <div class="form-group">
            <label>CPF</label>

            <input
                type="text"
                id="coordenador_cpf"
                placeholder="Digite o CPF do coordenador">
        </div>

        <div class="form-group">
            <label>Email</label>

            <input
                type="email"
                id="coordenador_email"
                placeholder="Digite o email do coordenador">
        </div>

        <div class="form-group">
            <label>Senha</label>

            <input
                type="password"
                id="coordenador_senha"
                placeholder="Digite a senha do coordenador">
        </div>

        <div class="form-group">
            <label>Curso</label>

            <select id="select_curso">
                <option value="">
                    Selecione um curso
                </option>
            </select>
        </div>
    `;
}

function formAdministrador() {
    return `
        <div class="form-group">
            <label>Nome</label>
            <input type="text" id="admin_nome" placeholder="Digite o nome do administrador">
        </div>

        <div class="form-group">
            <label>CPF</label>
            <input type="text" id="admin_cpf" placeholder="Digite o CPF do administrador">
        </div>

        <div class="form-group">
            <label>Email</label>
            <input type="email" id="admin_email" placeholder="Digite o email do administrador">
        </div>

        <div class="form-group">
            <label>Senha</label>
            <input type="password" id="admin_senha" placeholder="Digite a senha do administrador">
        </div>
    `;
}
