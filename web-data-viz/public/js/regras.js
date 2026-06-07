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

function abrirEdicao(id, classificacao, kpi, descricao, cor, inferior, superior) {
    abrirModalEdicaoRegra(id, classificacao, kpi, descricao, cor, inferior, superior);
}

function abrirDelecao(id) {
    abrirModalDelecaoRegra(id);
}

async function carregarTabela() {
    try {
        const id_instituicao =  sessionStorage.getItem("ID_INSTITUICAO");
    

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
                <button type="button" 
                        class="table-action-button btn-editar-regra" 
                        title="Editar" 
                        data-regra='${JSON.stringify(regra).replace(/'/g, "&apos;")}'>
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

    tbody.querySelectorAll(".btn-editar-regra").forEach(botao => {
        botao.addEventListener("click", function() {
            const dadosRegra = JSON.parse(this.getAttribute("data-regra"));
            
            abrirEdicao(
                dadosRegra.id_regra,
                dadosRegra.classificacao,
                dadosRegra.id_kpi,
                dadosRegra.descricao,
                dadosRegra.cor_hexadecimal,
                dadosRegra.limite_inferior,
                dadosRegra.limite_superior
            );
        });
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

    // Descrição obrigatória
    if (!descricaoInput.value.trim()) {
        showToast(
            "danger",
            "Campo obrigatório",
            "A descrição deve ser preenchida."
        );
        return;
    }

    const inferior = Number(limiteInferiorInput.value);
    const superior = Number(limiteSuperiorInput.value);

    // Limite inferior obrigatório
    if (limiteInferiorInput.value.trim() === "") {
        showToast(
            "danger",
            "Campo obrigatório",
            "Informe o limite inferior."
        );
        return;
    }

    // Limite superior obrigatório
    if (limiteSuperiorInput.value.trim() === "") {
        showToast(
            "danger",
            "Campo obrigatório",
            "Informe o limite superior."
        );
        return;
    }

    // Validação do intervalo
    if (inferior > superior) {
        showToast(
            "danger",
            "Intervalo inválido",
            "O limite inferior não pode ser maior que o limite superior."
        );
        return;
    }

    const dados = {
        idInstituicao: id_instituicao,
        idKpi: kpiInput.value,
        classificacao: classificacaoInput.value.toUpperCase(),
        descricao: descricaoInput.value,
        cor: corInput.value.replace("#", ""),
        limiteInferior: limiteInferiorInput.value,
        limiteSuperior: limiteSuperiorInput.value
    };

    try {
        const res = await fetch("/regras/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const resposta = await res.json();

        if (!res.ok) {
            showToast(
                "danger",
                "Erro ao cadastrar regra",
                "Houve um erro ao cadastrar a regra."
            );
            return;
        }

        showToast(
            "success",
            "Regra cadastrada",
            "Regra cadastrada com sucesso."
        );

        fecharModal();
        await carregarTabela();

    } catch (erro) {
        console.error(erro);

        showToast(
            "danger",
            "Erro ao se conectar com o servidor",
            "Houve um erro ao conectar com o servidor."
        );
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

    if (!descricaoInput.value.trim()) {
        showToast(
            "danger",
            "Campo obrigatório",
            "A descrição deve ser preenchida."
        );
        return;
    }

    const inferior = Number(limiteInferiorInput.value);
    const superior = Number(limiteSuperiorInput.value);

    if (limiteInferiorInput.value.trim() === "") {
        showToast(
            "danger",
            "Campo obrigatório",
            "Informe o limite inferior."
        );
        return;
    }

    if (limiteSuperiorInput.value.trim() === "") {
        showToast(
            "danger",
            "Campo obrigatório",
            "Informe o limite superior."
        );
        return;
    }

    if (inferior > superior) {
        showToast(
            "danger",
            "Intervalo inválido",
            "O limite inferior não pode ser maior que o limite superior."
        );
        return;
    }

    const dados = {
        idKpi: kpiInput.value,
        classificacao: classificacaoInput.value.toUpperCase(),
        descricao: descricaoInput.value,
        cor: corInput.value.replace("#", ""),
        limiteInferior: limiteInferiorInput.value,
        limiteSuperior: limiteSuperiorInput.value
    };

    try {
        const res = await fetch(`/regras/editar/${idRegra}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const resposta = await res.json();

        if (!res.ok) {
            showToast(
                "danger",
                "Erro ao editar regra",
                "Houve um erro ao editar a regra."
            );
            return;
        }

        showToast(
            "success",
            "Regra editada com sucesso",
            "A regra foi editada com sucesso."
        );

        fecharModal();
        await carregarTabela();

    } catch (erro) {
        console.error(erro);

        showToast(
            "danger",
            "Erro ao se conectar com o servidor",
            "Houve um erro ao conectar com o servidor."
        );
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

        showToast("success", "Regra deletada com sucesso", "A regra foi deletada com sucesso.");
        fecharModal();
        await carregarTabela();
    } catch (erro) {
        console.error(erro);
        showToast("danger", "Erro ao se conectar com o servidor", "Houve um erro ao conectar com o servidor.");
    }
}
