const POR_PAGINA = 2;

let todasInstituicoes = [];
let paginaAtual = 1;

function criarCard(inst) {
    const card = document.createElement("div");

    const id    = inst.id || inst.id_instituicao;
    const nome  = inst.nome ?? "Sem nome";
    const qtd   = inst.total_usuarios ?? 0;
    const ativos = inst.usuarios_ativos ?? 0;

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

function renderInstituicoes(dados) {
    const lista = document.getElementById("lista_instituicoes");
    if (!lista) return;

    lista.innerHTML = "";

    if (!dados.length) {
        lista.innerHTML = "<p>Nenhuma instituição encontrada</p>";
        renderPaginacao(0);
        return;
    }

    const inicio = (paginaAtual - 1) * POR_PAGINA;
    const pagina = dados.slice(inicio, inicio + POR_PAGINA);

    pagina.forEach(inst => lista.appendChild(criarCard(inst)));
    renderPaginacao(dados.length);
}

function renderPaginacao(total) {
    let container = document.getElementById("paginacao");
    if (!container) return;

    const totalPaginas = Math.ceil(total / POR_PAGINA);
    container.innerHTML = "";

    if (totalPaginas <= 1) return;

    const info = document.createElement("span");
    info.className = "pag-info";
    info.textContent = `Página ${paginaAtual} de ${totalPaginas}`;

    const btnAnterior = document.createElement("button");
    btnAnterior.className = "pag-btn";
    btnAnterior.textContent = "← Anterior";
    btnAnterior.disabled = paginaAtual === 1;
    btnAnterior.onclick = () => irParaPagina(paginaAtual - 1);

    const btnProximo = document.createElement("button");
    btnProximo.className = "pag-btn";
    btnProximo.textContent = "Próximo →";
    btnProximo.disabled = paginaAtual === totalPaginas;
    btnProximo.onclick = () => irParaPagina(paginaAtual + 1);

    container.appendChild(btnAnterior);
    container.appendChild(info);
    container.appendChild(btnProximo);
}

function irParaPagina(pagina) {
    paginaAtual = pagina;
    const termo = document.getElementById("pesquisa_instituicao")?.value.trim() ?? "";
    const dados = filtrarDados(termo);
    renderInstituicoes(dados);
    document.getElementById("lista_instituicoes")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function filtrarDados(termo) {
    if (!termo) return todasInstituicoes;
    const lower = termo.toLowerCase();
    return todasInstituicoes.filter(i => (i.nome ?? "").toLowerCase().includes(lower));
}

async function buscarInstituicoes() {
    try {
        const res  = await fetch("/administrador");
        const data = await res.json();
        todasInstituicoes = Array.isArray(data.dados) ? data.dados : [];
    } catch (erro) {
        console.error("Erro ao buscar instituições:", erro);
        todasInstituicoes = [];
    }

    paginaAtual = 1;
    renderInstituicoes(todasInstituicoes);
}

let timerBusca;

function configurarBuscaDinamica() {
    const input = document.getElementById("pesquisa_instituicao");
    if (!input) return;

    input.addEventListener("input", () => {
        const termo = input.value.trim();
        clearTimeout(timerBusca);

        timerBusca = setTimeout(() => {
            paginaAtual = 1;

            if (termo.length === 0) {
                renderInstituicoes(todasInstituicoes);
                return;
            }

            const local = filtrarDados(termo);
            renderInstituicoes(local);

            executarPesquisa(termo);
        }, 300);
    });
}

async function executarPesquisa(termo) {
    try {
        const response = await fetch(`/administrador/search?termo=${encodeURIComponent(termo)}`);
        const data = await response.json();

        if (data.sucesso) {
            todasInstituicoes = Array.isArray(data.dados) ? data.dados : [];
            renderInstituicoes(filtrarDados(termo));
        }
    } catch (erro) {
        console.error("Erro na pesquisa:", erro);
    }
}

window.onload = () => {
    buscarInstituicoes();
    configurarBuscaDinamica();
};