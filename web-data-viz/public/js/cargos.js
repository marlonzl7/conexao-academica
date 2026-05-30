const API = "/cargos";

let cargoSelecionadoId = null;

async function carregarCargos() {

    let data = [];

    try {

        const response = await fetch(API);
        if (!response.ok) {
            throw new Error("Erro na API");
        }

        data = await response.json();
        data = Array.isArray(data) ? data : data.dados || [];

    } catch {
        console.error(
            "Não foi possível carregar os cargos"
        );
    }

    const tabela =
    document.getElementById("tabelaCargos");

    tabela.innerHTML = "";

    data.forEach(cargo => {
        const cargoNomeEscapado = cargo.nome ? cargo.nome.replace(/'/g, "\\'") : "";

        tabela.innerHTML += `
            <tr>

                <td>
                    ${cargo.nome}
                </td>

                <td class="acoes-tabela">

                    <button
                        type="button"
                        class="table-action-button"
                        onclick="abrirModalEditarCargo(${cargo.id_cargo}, '${cargoNomeEscapado}')"
                        title="Editar">
                        <img src="/assets/icons/write-icon.png" alt="Editar" class="acoes-tabela-img table-action-icon">
                    </button>

                    <button
                        type="button"
                        class="table-action-button del"
                        onclick="abrirModalExcluirCargo(${cargo.id_cargo})"
                        title="Excluir">
                        <img src="/assets/icons/delete-icon.png" alt="Excluir" class="acoes-tabela-img table-action-icon">
                    </button>

                </td>

            </tr>
        `;
    });
}

async function criarCargo() {
    const nome =
        document
            .getElementById("inputNovo")
            .value
            .trim();

    if (!nome) {
        return;
    }

    try {
        await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                nome
            })
        });

        fecharModal();
        carregarCargos();

    } catch (erro) {
        console.error(
            "Erro ao criar cargo:",
            erro
        );
    }
}

async function atualizarCargo(id) {
    const nome =
        document
            .getElementById("inputEditar")
            .value
            .trim();

    if (!nome) {
        return;
    }

    try {
        await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                nome
            })
        });

        fecharModal();

        carregarCargos();

    } catch (erro) {
        console.error(
            "Erro ao atualizar cargo:",
            erro
        );
    }
}

async function deletarCargo(id) {

    try {
        await fetch(
            `${API}/${id}`,
            {
                method: "DELETE"
            }
        );

        fecharModal();
        carregarCargos();

    } catch (erro) {
        console.error(
            "Erro ao deletar cargo:",
            erro
        );
    }
}

window.onload = function () {
    carregarCargos();
}