window.regraKpis = [];

document.addEventListener("DOMContentLoaded", () => {
    carregarTabela();
    carregarKpis();
});

function preencherKpis() {
    document.querySelectorAll("select[id$='-kpi']").forEach(select => {
        select.innerHTML = "";
        window.regraKpis.forEach(kpi => {
            const option = document.createElement("option");
            option.value = kpi.id_kpi;
            option.textContent = kpi.nome;
            select.appendChild(option);
        });
    });
}

function abrirEdicao(id, classificacao, kpi, inferior, superior) {
    abrirModalEdicaoRegra(id, classificacao, kpi, inferior, superior);
}

function abrirDelecao(id) {
    abrirModalDelecaoRegra(id);
}

async function carregarTabela() {
    try {
        const id_instituicao = sessionStorage.getItem("ID_INSTITUICAO");

        const res = await fetch(`/regras?id_instituicao=${id_instituicao}`);
        const resposta = await res.json();

        if (!res.ok) {
            showToast("danger", "Erro ao carregar as regras", "Houve um erro ao carregar as regras.");
            return;
        }

        renderizarTabela(resposta.dados);

    } catch (erro) {
        console.error(erro);
        showToast("danger", "Erro ao se conectar com o servidor", "Houve um erro ao conectar com o servidor.");
    }
}

function renderizarTabela(dados) {
    const tbody = document.querySelector(".tabela tbody");
    tbody.innerHTML = "";

    if (!dados || dados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">Nenhuma regra cadastrada.</td>
            </tr>`;
        return;
    }

    dados.forEach(regra => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${regra.classificacao}</td>
            <td>${regra.nome_kpi}</td>
            <td>${regra.descricao}</td>
            <td>
                <div style="
                    width:20px;
                    height:20px;
                    background:#${regra.cor_hexadecimal};
                    border-radius:4px;
                "></div>
            </td>
            <td>${regra.limite_inferior}%</td>
            <td>${regra.limite_superior}%</td>
            <td class="acoes-tabela">
                <button type="button" class="table-action-button" title="Editar" onclick='abrirEdicao(
                            ${regra.id_regra},
                            '${regra.classificacao}',
                            ${regra.id_kpi},
                            '${regra.descricao}',
                            '${regra.cor_hexadecimal}',
                            ${regra.limite_inferior},
                            ${regra.limite_superior}
                        )'>
                    <img src="/assets/icons/write-icon.png"
                        class="acoes-tabela-img table-action-icon"
                        alt="Editar">
                </button>

                <button type="button" class="table-action-button del" title="Excluir" onclick="abrirDelecao(${regra.id_regra})">
                    <img src="/assets/icons/delete-icon.png"
                        class="acoes-tabela-img table-action-icon"
                        alt="Excluir">
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

        window.regraKpis = resposta.dados || [];
        preencherKpis();

    } catch (erro) {
        console.error(erro);
    }
}

async function cadastrarRegra() {
    const id_instituicao = sessionStorage.getItem("ID_INSTITUICAO");

    const kpiInput = document.getElementById("cadastro-kpi");
    const classificacaoInput = document.getElementById("cadastro-classificacao");
    const descricaoInput = document.getElementById("cadastro-descricao");
    const corInput = document.getElementById("cadastro-cor");
    const limiteInferiorInput = document.getElementById("cadastro-limite_inferior");
    const limiteSuperiorInput = document.getElementById("cadastro-limite_superior");

    if (
        validarClassificacao(classificacaoInput) &&
        validarDescricao(descricaoInput) &&
        validarLimiteInferior(limiteInferiorInput, limiteSuperiorInput) &&
        validarLimiteSuperior(limiteSuperiorInput, limiteInferiorInput)
    ) {
        const dados = {
            idInstituicao: id_instituicao,
            idKpi: kpiInput.value,
            classificacao: classificacaoInput.value,
            descricao: descricaoInput.value,
            cor: corInput.value.replace("#", ""),
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
                showToast("danger", "Erro ao cadastrar regra", "Houve um erro ao cadastrar a regra.");
                return;
            }

            showToast("sucess", "Regra cadastrada", "Regra cadastrada com sucesso.");
            fecharModal();
            await carregarTabela();
        } catch (erro) {
            console.error(erro);
            showToast("danger", "Erro ao se conectar com o servidor", "Houve um erro ao conectar com o servidor.");
        }
    } else {
        showToast("danger", "Verifique os campos", "Campos obrigatórios não preenchidos.");
    }
}

async function atualizarRegra() {
    const kpiInput = document.getElementById("edicao-kpi");
    const idRegra = document.getElementById("edicao-regra-id").value;

    const classificacaoInput = document.getElementById("edicao-classificacao");
    const descricaoInput = document.getElementById("edicao-descricao");
    const corInput = document.getElementById("edicao-cor");
    const limiteInferiorInput = document.getElementById("edicao-limite_inferior");
    const limiteSuperiorInput = document.getElementById("edicao-limite_superior");

    if (
        validarClassificacao(classificacaoInput) &&
        validarDescricao(descricaoInput) &&
        validarLimiteInferior(limiteInferiorInput, limiteSuperiorInput) &&
        validarLimiteSuperior(limiteSuperiorInput, limiteInferiorInput) 
    ) {
        const dados = {
            idKpi: kpiInput.value,
            classificacao: classificacaoInput.value,
            descricao: descricaoInput.value,
            cor: corInput.value.replace("#", ""),
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
                showToast("danger", "Erro ao editar regra", "Houve um erro ao editar a regra.");
                return;
            }

            showToast("sucess", "Regra editada com sucesso", "A regra foi editada com sucesso.");
            fecharModal();
            await carregarTabela();
        } catch (erro) {
            console.error(erro);
            showToast("danger", "Erro ao se conectar com o servidor", "Houve um erro ao conectar com o servidor.");
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
            showToast("danger", "Erro ao deletar regra", "Houve um erro ao deletar a regra.");
            return;
        }

        showToast("sucess", "Regra deletada com sucesso", "A regra foi deletada com sucesso.");
        fecharModal();
        await carregarTabela();
    } catch (erro) {
        console.error(erro);
        showToast("danger", "Erro ao se conectar com o servidor", "Houve um erro ao conectar com o servidor.");
    }
}