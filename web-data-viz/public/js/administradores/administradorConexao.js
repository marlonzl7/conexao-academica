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

        <a href="./administradorDetalhes.html?id=${id}" class="btn-acessar">
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
            console.log(data);

            lista.innerHTML = "";

            data.dados.forEach(inst => {
                const card = criarCard(inst);
                lista.appendChild(card);
            });
        })
    }
    catch(error){
            console.error("Erro ao buscar instituições: ", error);
            alert("Erro ao buscar instituições.")
    };
}

window.onload = buscarInstituicoes;
