window.formCadastroRegra = function () {
    return `
        <input type="hidden" id="cadastro-regra-id">

        <div class="form-group">
        <label>Classificação</label>
        <select id="cadastro-classificacao">
        <option value="">Selecione uma classificação</option>
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
            <input type="number" id="cadastro-limite_inferior" min="0">
        </div>

        <div class="form-group">
            <label>Limite superior</label>
           <input type="number" id="cadastro-limite_superior" min="0">
        </div>
    `;
};

window.formEdicaoRegra = function () {
    return `
        <input type="hidden" id="edicao-regra-id">

        <div class="form-group">
            <label>Classificação</label>
            <select id="edicao-classificacao">
                <option value="ALTO">Alto</option>
                <option value="MEDIO">Médio</option>
                <option value="BAIXO">Baixo</option>
            </select>
        </div>

        <div class="form-group">
            <label>KPI</label>
            <select id="edicao-kpi"></select>
        </div>

        <div class="form-group">
            <label>Descrição</label>
            <input type="text" id="edicao-descricao">
        </div>

        <div class="form-group">
            <label>Cor</label>
            <input type="color" id="edicao-cor">
        </div>

        <div class="form-group">
            <label>Limite inferior</label>
           <input type="number" id="edicao-limite_inferior" min="0">
        </div>

        <div class="form-group">
            <label>Limite superior</label>
           <input type="number" id="edicao-limite_superior" min="0">
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
