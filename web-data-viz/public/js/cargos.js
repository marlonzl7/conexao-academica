const API = "/cargos";

let cargoSelecionadoId = null;

function escapar(str) {
    return str?.replace(/'/g, "\\'") ?? "";
}

function getInput(id) {
    return document.getElementById(id)?.value.trim() ?? "";
}

async function carregarCargos() {
    let data = [];

    try {
        const response = await fetch(API);

        if (!response.ok) throw new Error("Erro na API");

        const json = await response.json();
        data = Array.isArray(json) ? json : (json.dados ?? []);

    } catch {
        console.error("Não foi possível carregar os cargos.");
        showToast("danger", "Erro ao carregar cargos.", "Tente recarregar a página.");
    }

    renderizarTabela(data);
}

function renderizarTabela(cargos) {
    const tabela = document.getElementById("tabelaCargos");

    if (!cargos.length) {
        tabela.innerHTML = `
            <tr>
                <td colspan="2" style="text-align: center; color: #aaa;">
                    Nenhum cargo cadastrado.
                </td>
            </tr>
        `;
        return;
    }

    tabela.innerHTML = cargos.map(cargo => `
        <tr>
            <td>${cargo.nome}</td>
            <td class="acoes-tabela">
                <button
                    type="button"
                    class="table-action-button"
                    onclick="abrirModalEditarCargo(${cargo.id_cargo}, '${escapar(cargo.nome)}')"
                    title="Editar">
                    <img src="/assets/icons/write-icon.png" alt="Editar" class="table-action-icon">
                </button>
                <button
                    type="button"
                    class="table-action-button del"
                    onclick="abrirModalExcluirCargo(${cargo.id_cargo})"
                    title="Excluir">
                    <img src="/assets/icons/delete-icon.png" alt="Excluir" class="table-action-icon">
                </button>
            </td>
        </tr>
    `).join("");
}

async function criarCargo() {
    const nome = getInput("inputNovo");
    if (!nome) return;

    try {
        const response = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome }),
        });

        if (!response.ok) throw new Error("Erro ao criar");

        showToast("success", "Cargo criado", "Cargo cadastrado com sucesso!");
        fecharModal();
        carregarCargos();

    } catch (erro) {
        console.error("Erro ao criar cargo:", erro);
        showToast("danger", "Erro ao criar cargo.", "Tente novamente.");
    }
}

async function atualizarCargo(id) {
    const nome = getInput("inputEditar");
    if (!nome) return;

    try {
        const response = await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome }),
        });

        if (!response.ok) throw new Error("Erro ao atualizar");

        showToast("success", "Cargo atualizado", "Cargo atualizado com sucesso!");
        fecharModal();
        carregarCargos();

    } catch (erro) {
        console.error("Erro ao atualizar cargo:", erro);
        showToast("danger", "Erro ao atualizar cargo.", "Tente novamente.");
    }
}

async function deletarCargo(id) {
    try {
        const response = await fetch(`${API}/${id}`, { method: "DELETE" });

        if (!response.ok) throw new Error("Erro ao deletar");

        showToast("success", "Cargo excluído", "Cargo excluído com sucesso.");
        fecharModal();
        carregarCargos();

    } catch (erro) {
        console.error("Erro ao deletar cargo:", erro);
        showToast("danger", "Erro ao excluir cargo.", "Tente novamente.");
    }
}

window.onload = carregarCargos; 