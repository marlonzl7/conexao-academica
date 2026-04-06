function abrirModal(id) {
    document.getElementById(id).classList.remove("hidden");
}

function fecharModal(id) {
    document.getElementById(id).classList.add("hidden");
}

function cadastrarRegra() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <td>${regra.classificacao}</td>
    <td>${regra.kpi}</td>
    <td>${regra.limiteInferior}</td>
    <td>${regra.limiteSuperior}</td>
    <td class="acoes-tabela">
        <button><img src="./assets/icons/write-icon.png" class="acoes-tabela-img"></button>
        <button><img src="./assets/icons/delete-icon.png" class="acoes-tabela-img"></button>
    </td>
    `
}

function editarRegra() {

}

function apagarRegra() {

}