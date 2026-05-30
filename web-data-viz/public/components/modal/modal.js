function initModal() {
    const modalRoot = document.getElementById("modal-root");

    if (!modalRoot) return;

    modalRoot.innerHTML = `
        <div id="modal-overlay" class="overlay hidden">
            <div id="modal-container" class="modal">

                <div class="modal-header">
                    <h2 id="modal-title"></h2>

                    <button class="fechar-modal" type="button" onclick="fecharModal()">✕</button>
                </div>

                <div class="modal-body" id="modal-body"></div>
                <div class="modal-footer" id="modal-footer"></div>

            </div>
        </div>
    `;

    const overlay = document.getElementById("modal-overlay");
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            fecharModal();
        }
    });
}

initModal();

window.abrirModal = function ({
    titulo = "",
    conteudo = "",
    botoes = "",
    tamanho = "md",
    tipo = "default"
}) {

    const modal =
        document.getElementById("modal-container");

    const classeTamanho =
        MODAL_CONFIG.tamanhos[tamanho];

    const classeTipo =
        MODAL_CONFIG.tipos[tipo];

    modal.className = `
        modal
        ${classeTamanho}
        ${classeTipo}
    `;

    document.getElementById("modal-title").innerHTML = titulo;

    document.getElementById("modal-body").innerHTML = conteudo;

    document.getElementById("modal-footer").innerHTML = botoes;

    document
        .getElementById("modal-overlay")
        .classList
        .remove("hidden");
}

window.fecharModal = function () {

    document
        .getElementById("modal-overlay")
        .classList
        .add("hidden");
}