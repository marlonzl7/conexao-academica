window.abrirModalNovoCargo = function () {
    abrirModal({
        titulo: "Novo Cargo",
        conteudo: formNovoCargo(),
        botoes: botoesCadastro("criarCargo"),
        tamanho: "sm",
        tipo: "default"
    });
};

window.abrirModalEditarCargo = function (id, nome) {
    abrirModal({
        titulo: "Editar Cargo",
        conteudo: formEditarCargo(nome),
        botoes: `
            <button class="modal-botao-cancelar" onclick="fecharModal()">
                Cancelar
            </button>

            <button class="modal-botao-confirmar" onclick="atualizarCargo(${id})">
                Salvar
            </button>
        `,
        tamanho: "sm",
        tipo: "warning"
    });
};

window.abrirModalExcluirCargo = function (id) {
    abrirModal({
        titulo: "Excluir Cargo",
        conteudo: `
            <div class="modal-confirmacao">
                <h3>Tem certeza que deseja excluir este cargo?</h3>
                <p>Esta ação não pode ser desfeita. O registro será removido permanentemente.</p>
            </div>
        `,
        botoes: `
            <button class="modal-botao-cancelar" onclick="fecharModal()">
                Cancelar
            </button>

            <button class="modal-botao-deletar" onclick="deletarCargo(${id})">
                Excluir
            </button>
        `,
        tamanho: "sm",
        tipo: "danger"
    });
};
