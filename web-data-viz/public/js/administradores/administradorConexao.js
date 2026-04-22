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

function buscarInstituicoes() {
    const lista = document.getElementById("lista_instituicoes");

    if (!lista) {
        console.error("Instituições não encontradas")
        return;
    }

    const url = '/administrador/getInstituicoes';

    try {
    fetch(url)
    .then(res => res.json())
    .then(data => {
        lista.innerHTML = "";
        data.dados.forEach(inst => {
            const card = criarCard(inst);
            lista.appendChild(card);
        });
    })
    .catch(error => {
        console.error("Erro ao buscar instituições: ", error);
        alert("Erro ao buscar instituições.");
    });
    } catch (error) {
        console.error("Erro inesperado: ", error);
        alert("Erro inesperado ao buscar instituições.");
    }
}

let timerBusca;

function configurarBuscaDinamica() {
    const inputPesquisa = document.getElementById("pesquisa_instituicao");

    inputPesquisa.addEventListener("input", () => {
        const termo = inputPesquisa.value.trim();

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
    const url = `/administrador/pesquisar?termo=${encodeURIComponent(termo)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.sucesso) {
            renderResponsaveis(data.dados); 
        }
    } catch (error) {
        console.error("Erro na pesquisa dinâmica:", error);
    }
}

window.onload = () => {
    buscarInstituicoes(); 
    configurarBuscaDinamica();
};
