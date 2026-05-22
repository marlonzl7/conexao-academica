window.addEventListener("DOMContentLoaded", () => {

    const modalRoot = document.getElementById("modal-root");

    modalRoot.innerHTML = `
        <div id="modal-overlay" class="overlay hidden">

            <div class="modal">

                <div class="modal-header">

                    <h2 id="modal-title"></h2>

                    <span
                        class="fechar-modal"
                        onclick="fecharModal()">

                        X
                    </span>

                </div>

                <div
                    class="modal-body"
                    id="modal-body">
                </div>

                <div
                    class="modal-footer"
                    id="modal-footer">
                </div>

            </div>

        </div>
    `;
});

window.abrirModal = function ({
    titulo,
    conteudo,
    botoes
}) {

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