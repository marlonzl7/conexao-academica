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
            <label>CPF</label>

            <input
                type="text"
                id="diretor_cpf"
                placeholder="Ex: 19480967540">
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
                id="diretor_senha"
                placeholder="Ex: cT202#R">
        </div>
    `;
}

function formCoordenador() {

    return `
        <div class="form-group">
            <label>Nome</label>

            <input
                type="text"
                id="coordenador_nome">
        </div>

        <div class="form-group">
            <label>CPF</label>

            <input
                type="text"
                id="coordenador_cpf">
        </div>

        <div class="form-group">
            <label>Email</label>

            <input
                type="email"
                id="coordenador_email">
        </div>

        <div class="form-group">
            <label>Senha</label>

            <input
                type="password"
                id="coordenador_senha">
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
            <input type="text" id="admin_nome" placeholder="Ex: Carlos">
        </div>

        <div class="form-group">
            <label>CPF</label>
            <input type="text" id="admin_cpf" placeholder="Ex: 19480967540">
        </div>

        <div class="form-group">
            <label>Email</label>
            <input type="email" id="admin_email" placeholder="Ex: carlos@gmail.com">
        </div>

        <div class="form-group">
            <label>Senha</label>
            <input type="password" id="admin_senha" placeholder="Ex: cT202#R">
        </div>
    `;
}