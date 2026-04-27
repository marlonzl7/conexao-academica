function criarCard(inst) {
    const card = document.createElement("div");

    const id = inst.id || inst.id_instituicao;
    const nome = inst.nome ?? "Sem nome";
    const qtd = inst.qtdPessoas ?? 0;
    const ativos = inst.ativos ?? 0;

    card.classList.add("instituicao-card");

    card.innerHTML = `
        <div class="inst-info">
            <div class="inst-logo-placeholder">
                <img src="../../assets/icons/icon-predio.svg" alt="Icone Instituição">
            </div>
            <div class="inst-text">
                <h3>${nome}</h3>
            </div>
        </div>

        <img src="../../assets/icons/icon-user.svg" alt="Icone User">
        <span>${qtd} Pessoas</span>
        <span>${ativos} Ativos</span>

        <a href="./administradorDetalhesConexao.html?id=${id}" class="btn-acessar">
            Acessar →
        </a>
    `;

    return card;
}

function renderInstituicoes(listaDados) {
    const lista = document.getElementById("lista_instituicoes");

    if (!lista) return;

    lista.innerHTML = "";

    const dados = Array.isArray(listaDados)
        ? listaDados
        : (listaDados?.dados ?? []);

    if (dados.length === 0) {
        lista.innerHTML = "<p>Nenhuma instituição encontrada</p>";
        return;
    }

    dados.forEach(inst => {
        const card = criarCard(inst);
        lista.appendChild(card);
    });
}

function buscarInstituicoes() {
    fetch(`/administrador`)
        .then(res => res.json())
        .then(data => {
            renderInstituicoes(data.dados);
        })
        .catch(error => {
            console.error("Erro ao buscar instituições: ", error);
        });
}

let timerBusca;

function configurarBuscaDinamica() {
    const input = document.getElementById("pesquisa_instituicao");

    if (!input) {
        console.error("Input não encontrado");
        return;
    }

    input.addEventListener("input", () => {
        const termo = input.value.trim();

        clearTimeout(timerBusca);

        if (termo.length === 0) {
            buscarInstituicoes();
            return;
        }

        timerBusca = setTimeout(() => {
            executarPesquisa(termo);
        }, 300);
    });
}

async function executarPesquisa(termo) {
    const lista = document.getElementById("lista_instituicoes");

    if (!lista) {
        console.error("Lista de instituições não encontrada");
        return;
    }
    
    lista.innerHTML = "<p>Buscando...</p>";

    try {
        const response = await fetch(`/administrador/search?termo=${encodeURIComponent(termo)}`);
        const data = await response.json();

        if (data.sucesso) {
            renderInstituicoes(data.dados);
        } else {
            lista.innerHTML = "<p>Erro na busca</p>";
        }
    } catch (error) {
        console.error("Erro na pesquisa dinâmica:", error);
        lista.innerHTML = "<p>Erro ao buscar</p>";
    }
}

window.onload = () => {
    buscarInstituicoes();
    configurarBuscaDinamica();
};