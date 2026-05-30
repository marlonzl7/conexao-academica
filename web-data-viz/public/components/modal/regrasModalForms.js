window.formCadastroRegra = function () {
    return `
        <input type="hidden" id="cadastro-regra-id" value="">

        <div class="form-group">
            <label>Classificação</label>
            <select id="cadastro-classificacao">
                <option value="BAIXO">Baixo</option>
                <option value="MEDIO">Médio</option>
                <option value="ALTO">Alto</option>
            </select>
        </div>
        <div class="form-group">
            <label>KPI</label>
            <select id="cadastro-kpi"></select>
        </div>
        <div class="form-group">
            <label>Limite inferior</label>
            <input type="text" id="cadastro-limite_inferior" placeholder="Digite o limite inferior (ex: 50%)">
        </div>
        <div class="form-group">
            <label>Limite superior</label>
            <input type="text" id="cadastro-limite_superior" placeholder="Digite o limite superior (ex: 80%)">
        </div>
    `;
};

window.formEdicaoRegra = function () {
    return `
        <input type="hidden" id="edicao-regra-id" value="">

        <div class="form-group">
            <label>Classificação</label>
            <select id="edicao-classificacao">
                <option value="BAIXO">Baixo</option>
                <option value="MEDIO">Médio</option>
                <option value="ALTO">Alto</option>
            </select>
        </div>
        <div class="form-group">
            <label>KPI</label>
            <select id="edicao-kpi"></select>
        </div>
        <div class="form-group">
            <label>Limite inferior</label>
            <input type="text" id="edicao-limite_inferior" placeholder="Digite o limite inferior (ex: 50%)">
        </div>
        <div class="form-group">
            <label>Limite superior</label>
            <input type="text" id="edicao-limite_superior" placeholder="Digite o limite superior (ex: 80%)">
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
