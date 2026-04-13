
document.addEventListener("DOMContentLoaded", () => {
    iniciar();
});

function abrirModal(id) {
    document.getElementById(id).classList.remove("hidden");
}

function fecharModal(id) {
    document.getElementById(id).classList.add("hidden");
}

document.querySelectorAll(".overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) fecharModal(overlay.id);
    });
});

function iniciar() {
    const classificacaoInput = document.getElementById("classificacao");
    const limiteInferiorInput = document.getElementById("limite-inferior");
    const limiteSuperiorInput = document.getElementById("limite-superior");

    classificacaoInput.addEventListener("input", () => {
        validarCampo
    })
}

function cadastrarRegra() {

}

function editarRegra() {

}

function apagarRegra() {

}