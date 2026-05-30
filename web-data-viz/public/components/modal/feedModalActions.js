window.formEditarPost = function (texto) {
    return `
        <div class="form-group" style="grid-column: 1 / -1;">
            <label>Editar Post</label>
            <textarea id="editTexto">${texto}</textarea>
        </div>
    `;
};

window.formExcluirPost = function () {
    return `
        <div class="modal-confirmacao">
            <h3>Tem certeza que deseja excluir este post?</h3>
            <p>Esta ação não pode ser desfeita. O registro será removido permanentemente.</p>
        </div>
    `;
};

window.abrirModalEditarPost = function (btn) {
    window.postAtual = btn.closest(".post-card");

    abrirModal({
        titulo: "Editar Post",
        conteudo: formEditarPost(window.postAtual.querySelector(".post-text").innerText),
        botoes: `
            <button class="modal-botao-cancelar" onclick="fecharModal()">Cancelar</button>
            <button class="modal-botao-confirmar" onclick="salvarEdicao()">Salvar</button>
        `,
        tamanho: "sm",
        tipo: "default"
    });
};

window.abrirModalExcluirPost = function (btn) {
    window.postAtual = btn.closest(".post-card");

    abrirModal({
        titulo: "Excluir Post",
        conteudo: formExcluirPost(),
        botoes: botoesExcluir("confirmarExclusao"),
        tamanho: "sm",
        tipo: "danger"
    });
};
