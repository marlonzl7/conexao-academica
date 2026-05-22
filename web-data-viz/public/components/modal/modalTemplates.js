function botoesCadastro(callback) {

    return `
        <button
            class="modal-botao-cancelar"
            onclick="fecharModal()">

            Cancelar
        </button>

        <button
            class="modal-botao-confirmar"
            onclick="${callback}()">

            Salvar
        </button>
    `;
}

function botoesExcluir(callback) {

    return `
        <button
            class="modal-botao-cancelar"
            onclick="fecharModal()">

            Cancelar
        </button>

        <button
            class="modal-botao-deletar"
            onclick="${callback}()">

            Excluir
        </button>
    `;
}