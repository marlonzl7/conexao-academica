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
        const id_usuario = sessionStorage.getItem("ID_USUARIO");
        const res = await fetch(`/regras?id_usuario=${id_usuario}`);
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

    if (dados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5">Nenhuma regra cadastrada.</td>
            </tr>`;
        return;
    }

    dados.forEach(regra => {
        const tr = document.createElement("tr");

        console.log(regra);

        tr.innerHTML = `
            <td>${regra.nome_classificacao}</td>
            <td>${regra.nome_kpi}</td>
            <td>${regra.limite_inferior}%</td>
            <td>${regra.limite_superior}%</td>
            <td class="acoes-tabela">
                <button>
                    <img src="../assets/icons/write-icon.png" alt="Ícone de escrita"
                        class="acoes-tabela-img"
                        onclick="abrirEdicao(${regra.id_regra}, '${regra.classificacao}', ${regra.id_kpi}, ${regra.limite_inferior}, ${regra.limite_superior})">
                </button>
                <button>
                    <img src="../assets/icons/delete-icon.png" alt="Ícone de deleção"
                        class="acoes-tabela-img"
                        onclick="abrirDelecao(${regra.id_regra})">
                </button>
            </td>`;
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
                option.textContent = kpi.nome; // ajuste para o nome da coluna no seu banco
                select.appendChild(option);
            });
        });

    } catch (erro) {
        console.error(erro);
    }
}

async function cadastrarRegra() {
    const id_usuario = sessionStorage.getItem("ID_USUARIO");
    const kpiInput = document.getElementById("cadastro-kpi")
    const classificacaoInput = document.getElementById("cadastro-classificacao");
    const limiteInferiorInput = document.getElementById("cadastro-limite_inferior");
    const limiteSuperiorInput = document.getElementById("cadastro-limite_superior");

    if (
        validarClassificacao(classificacaoInput) &&
        validarLimiteInferior(limiteInferiorInput, limiteSuperiorInput) &&
        validarLimiteSuperior(limiteSuperiorInput, limiteInferiorInput)
    ) {
        const url = `/regras/cadastrar`;
        const dados = {
            idUsuario: id_usuario,
            kpi: kpiInput.value,
            classificacao: classificacaoInput.value,
            limiteInferior: limiteInferiorInput.value,
            limiteSuperior: limiteSuperiorInput.value,
        };

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados),
            });

            const resposta = await res.json();

            if (!res.ok) {
                alert(resposta.mensagem || "Erro ao realizar o cadastro de regras");
                return;
            }

            alert(resposta.mensagem);
            fecharModal("modal-overlay-cadastro");
        } catch (erro) {
            console.error(erro);
            alert("Erro ao se conectar com o servidor");
        }
    } else {
        alert("Verifique se todos os campos estão válidos e tente novamente.");
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
        const url = `/regras/editar/${idRegra}`
        const dados = {
            classificacao: classificacaoInput.value,
            kpi: kpiInput.value,
            limiteInferior: limiteInferiorInput.value,
            limiteSuperior: limiteSuperiorInput.value
        };

        try {
            const res = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados),
            });

            const resposta = await res.json();

            if(!res.ok) {
                alert(resposta.mensagem || "Erro ao realizar a edição de regras.");
                return;
            }

            alert(resposta.mensagem);
            fecharModal("modal-overlay-edicao");
        } catch (erro) {
            console.error(erro);
            alert("Erro ao se conectar com o servidor.")
        }
    } else {
        alert("Verifique se todos os campos estão válidos e tente novamente.");        
    }
}


async function deletarRegra() {
    const idRegra = document.getElementById("delecao-regra-id").value;
    
    if(!idRegra) {
        alert("Nenhum registro encontrado para exclusão.");
        return;
    }

    const url = `/regras/deletar/${idRegra}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json"  },
        });

        const resposta = await res.json();
    
        if(!res.ok) {
            alert(resposta.mensagem || "Erro ao deletar a regra.");
            return;
        }

        alert(resposta.mensagem);
        fecharModal("modal-overlay-delecao");
    } catch (erro) {
        console.error(erro);
        alert("Erro ao se conectar com o servidor.");
    }
}