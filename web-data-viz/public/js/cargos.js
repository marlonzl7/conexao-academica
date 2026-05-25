const API = "/cargos";
let cargoSelecionadoId = null;

async function carregarCargos() {
    let data = [];
    try {
        const response = await fetch(API);
        if (!response.ok) throw new Error("Erro na API");
        data = await response.json();
    } catch {
        console.error("Não foi possível carregar os cargos");
    }

    const tabela = document.getElementById("tabelaCargos");
    tabela.innerHTML = "";
    data.forEach(cargo => {
        tabela.innerHTML += `
                <tr>
                    <td>${cargo.nome}</td>
                    <td>
                        <button onclick="abrirModalEditar(${cargo.id_cargo}, '${cargo.nome}')" title="Editar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button onclick="abrirModalExcluir(${cargo.id_cargo})" title="Excluir">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                <path d="M10 11v6"/>
                                <path d="M14 11v6"/>
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                        </button>
                    </td>
                </tr>
            `;
    });
}

async function criarCargo() {
    const nome = document.getElementById("inputNovo").value.trim();
    if (!nome) return;
    try {
        await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome })
        });
    } catch { }
    document.getElementById("inputNovo").value = "";
    fecharModal("modalNovo");
    carregarCargos();
}

async function atualizarCargo() {
    const nome = document.getElementById("inputEditar").value.trim();
    if (!nome) return;
    try {
        await fetch(`${API}/${cargoSelecionadoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome })
        });
    } catch { }
    fecharModal("modalEditar");
    carregarCargos();
}

async function deletarCargo() {
    try {
        await fetch(`${API}/${cargoSelecionadoId}`, { method: "DELETE" });
    } catch { }
    fecharModal("modalExcluir");
    carregarCargos();
}

function abrirModalNovo() {
    document.getElementById("inputNovo").value = "";
    abrirModal("modalNovo");
}

function abrirModalEditar(id, nome) {
    cargoSelecionadoId = id;
    document.getElementById("inputEditar").value = nome;
    abrirModal("modalEditar");
}

function abrirModalExcluir(id) {
    cargoSelecionadoId = id;
    abrirModal("modalExcluir");
}

function abrirModal(id) {
    document.getElementById(id).classList.add("show");
}

function fecharModal(id) {
    document.getElementById(id).classList.remove("show");
}

document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", function (e) {
        if (e.target === modal) fecharModal(modal.id);
    });
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        document.querySelectorAll(".modal.show").forEach(m => fecharModal(m.id));
    }
});

window.onload = carregarCargos;
