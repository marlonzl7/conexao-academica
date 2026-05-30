window.formNovoCargo = function () {
    return `
        <div class="form-group">
            <label>Nome do Cargo</label>
            <input type="text" id="inputNovo" placeholder="Digite o nome do cargo">
        </div>
    `;
};

window.formEditarCargo = function (nome) {
    return `
        <div class="form-group">
            <label>Nome do Cargo</label>
            <input type="text" id="inputEditar" value="${nome}" placeholder="Digite o nome do cargo">
        </div>
    `;
};
