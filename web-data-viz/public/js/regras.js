document.addEventListener("DOMContentLoaded", () => {
    carregarTabela();
    carregarKpis();
});

function abrirModal(id) {
    document.getElementById(id).classList.remove("hidden");
}

function abrirEdicao(id, classificacao, kpi, inferior, superior) {
    document.getElementById("edicao-regra-id").value = id;
    document.getElementById("edicao-classificacao").value = classificacao;
    document.getElementById("edicao-kpi").value = kpi;
    document.getElementById("edicao-limite_inferior").value = inferior;
    document.getElementById("edicao-limite_superior").value = superior;

    abrirModal("modal-overlay-edicao");
}

function abrirDelecao(id) {
    document.getElementById("delecao-regra-id").value = id;
    abrirModal("modal-overlay-delecao");
}

function fecharModal(id) {
    document.getElementById(id).classList.add("hidden");
}

document.querySelectorAll(".overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) fecharModal(overlay.id);
    });
});

async function carregarTabela() {
    try {
        const id_instituicao = sessionStorage.getItem("ID_INSTITUICAO");

        const res = await fetch(`/regras?id_instituicao=${id_instituicao}`);
        const resposta = await res.json();

        if (!res.ok) {
            alert(resposta.mensagem || "Erro ao carregar as regras.");
            return;
        }

        renderizarTabela(resposta.dados);

    } catch (erro) {
        console.error(erro);
        alert("Erro ao se conectar com o servidor.");
    }
}

function renderizarTabela(dados) {
    const tbody = document.querySelector(".tabela tbody");
    tbody.innerHTML = "";

    if (!dados || dados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5">Nenhuma regra cadastrada.</td>
            </tr>`;
        return;
    }

    dados.forEach(regra => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${regra.nome_classificacao}</td>
            <td>${regra.nome_kpi}</td>
            <td>${regra.limite_inferior}%</td>
            <td>${regra.limite_superior}%</td>
            <td class="acoes-tabela">
                <button>
                    <img src="../assets/icons/write-icon.png"
                        class="acoes-tabela-img"
                        onclick='abrirEdicao(
                            ${regra.id_regra},
                            ${JSON.stringify(regra.nome_classificacao)},
                            ${regra.id_kpi},
                            ${regra.limite_inferior},
                            ${regra.limite_superior}
                        )'>
                </button>

                <button>
                    <img src="../assets/icons/delete-icon.png"
                        class="acoes-tabela-img"
                        onclick="abrirDelecao(${regra.id_regra})">
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

async function carregarKpis() {
    try {
        const res = await fetch("/kpis");
        const resposta = await res.json();

        if (!res.ok) {
            console.error("Erro ao carregar KPIs.");
            return;
        }

        const selects = document.querySelectorAll("select[id$='-kpi']");

        selects.forEach(select => {
            select.innerHTML = "";

            resposta.dados.forEach(kpi => {
                const option = document.createElement("option");
                option.value = kpi.id_kpi;
                option.textContent = kpi.nome;
                select.appendChild(option);
            });
        });

    } catch (erro) {
        console.error(erro);
    }
}

async function cadastrarRegra() {
    const id_instituicao = sessionStorage.getItem("ID_INSTITUICAO");

    const kpiInput = document.getElementById("cadastro-kpi");
    const classificacaoInput = document.getElementById("cadastro-classificacao");
    const limiteInferiorInput = document.getElementById("cadastro-limite_inferior");
    const limiteSuperiorInput = document.getElementById("cadastro-limite_superior");

    if (
        validarClassificacao(classificacaoInput) &&
        validarLimiteInferior(limiteInferiorInput, limiteSuperiorInput) &&
        validarLimiteSuperior(limiteSuperiorInput, limiteInferiorInput)
    ) {
        const dados = {
            idInstituicao: id_instituicao,
            idKpi: kpiInput.value,
            classificacao: classificacaoInput.value,
            limiteInferior: limiteInferiorInput.value,
            limiteSuperior: limiteSuperiorInput.value
        };

        try {
            const res = await fetch("/regras/cadastrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });

            const resposta = await res.json();

            if (!res.ok) {
                alert(resposta.mensagem || "Erro ao cadastrar regra.");
                return;
            }

            alert(resposta.mensagem);
            fecharModal("modal-overlay-cadastro");
            await carregarTabela();

        } catch (erro) {
            console.error(erro);
            alert("Erro ao se conectar com o servidor");
        }
    } else {
        alert("Verifique os campos.");
    }
}

async function atualizarRegra() {
    const idRegra = document.getElementById("edicao-regra-id").value;

    const classificacaoInput = document.getElementById("edicao-classificacao");
    const kpiInput = document.getElementById("edicao-kpi");
    const limiteInferiorInput = document.getElementById("edicao-limite_inferior");
    const limiteSuperiorInput = document.getElementById("edicao-limite_superior");

    if (
        validarClassificacao(classificacaoInput) &&
        validarLimiteInferior(limiteInferiorInput, limiteSuperiorInput) &&
        validarLimiteSuperior(limiteSuperiorInput, limiteInferiorInput)
    ) {
        const dados = {
            idInstituicao: sessionStorage.getItem("ID_INSTITUICAO"),
            idKpi: kpiInput.value,
            classificacao: classificacaoInput.value,
            limiteInferior: limiteInferiorInput.value,
            limiteSuperior: limiteSuperiorInput.value
        };

        try {
            const res = await fetch(`/regras/editar/${idRegra}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });

            const resposta = await res.json();

            if (!res.ok) {
                alert(resposta.mensagem || "Erro ao editar regra.");
                return;
            }

            alert(resposta.mensagem);
            fecharModal("modal-overlay-edicao");
            await carregarTabela();

        } catch (erro) {
            console.error(erro);
            alert("Erro ao se conectar com o servidor.");
        }
    }
}

async function deletarRegra() {
    const idRegra = document.getElementById("delecao-regra-id").value;

    if (!idRegra) {
        alert("Nenhuma regra selecionada.");
        return;
    }

    try {
        const res = await fetch(`/regras/deletar/${idRegra}`, {
            method: "DELETE"
        });

        const resposta = await res.json();

        if (!res.ok) {
            alert(resposta.mensagem || "Erro ao deletar.");
            return;
        }

        alert(resposta.mensagem);
        fecharModal("modal-overlay-delecao");
        await carregarTabela();

    } catch (erro) {
        console.error(erro);
        alert("Erro ao se conectar com o servidor.");
    }
}