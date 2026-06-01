window.formCadastroRegra = function () {
    return `
        <input type="hidden" id="cadastro-regra-id">

        <div class="form-group">
            <label>Classificação</label>
            <select id="cadastro-classificacao">
                <option value="ALTO">Alto</option>
                <option value="MEDIO">Médio</option>
                <option value="BAIXO">Baixo</option>
            </select>
        </div>

        <div class="form-group">
            <label>KPI</label>
            <select id="cadastro-kpi"></select>
        </div>

        <div class="form-group">
            <label>Descrição</label>
            <input type="text" id="cadastro-descricao">
        </div>

        <div class="form-group">
            <label>Cor</label>
            <input type="color" id="cadastro-cor">
        </div>

        <div class="form-group">
            <label>Limite inferior</label>
            <input type="text" id="cadastro-limite_inferior">
        </div>

        <div class="form-group">
            <label>Limite superior</label>
            <input type="text" id="cadastro-limite_superior">
        </div>
    `;
};

window.formEdicaoRegra = function () {
    return `
        <input type="hidden" id="cadastro-regra-id">

        <div class="form-group">
            <label>Classificação</label>
            <select id="cadastro-classificacao">
                <option value="ALTO">Alto</option>
                <option value="MEDIO">Médio</option>
                <option value="BAIXO">Baixo</option>
            </select>
        </div>

        <div class="form-group">
            <label>KPI</label>
            <select id="cadastro-kpi"></select>
        </div>

        <div class="form-group">
            <label>Descrição</label>
            <input type="text" id="cadastro-descricao">
        </div>

        <div class="form-group">
            <label>Cor</label>
            <input type="color" id="cadastro-cor">
        </div>

        <div class="form-group">
            <label>Limite inferior</label>
            <input type="text" id="cadastro-limite_inferior">
        </div>

        <div class="form-group">
            <label>Limite superior</label>
            <input type="text" id="cadastro-limite_superior">
        </div>
    `;
};

window.formDelecaoRegra = function () {
    return `
        <input type="hidden" id="delecao-regra-id" value="">

        <div class="modal-confirmacao">
            <h3>Tem certeza que deseja excluir esta regra?</h3>
            <p>Esta ação não pode ser desfeita. O registro será removido permanentemente.</p>
        </div>
    `;
};
