// administradorDetalhesConexao.js
async function renderResponsaveis(dados) {
    const cardDiretor = document.getElementById("card_diretor");
    const cardCoordenador = document.getElementById("card_coordenador");
    const cardAdministrador = document.getElementById("card_administrador");

    cardDiretor.innerHTML = "";
    cardCoordenador.innerHTML = "";
    cardAdministrador.innerHTML = "";

    const listaPessoas = Array.isArray(dados) ? dados : [dados];

    listaPessoas.forEach(pessoa => {
        const nome = pessoa.nomePessoa || "Não atribuído";
        const email = pessoa.emailPessoa || "N/A";
        const cargo = pessoa.cargoNome ? pessoa.cargoNome.toLowerCase() : "";

        const htmlPessoa = `
            <div class="pessoa-info" style="margin-bottom: 20px;">
                <div class="avatar-box ${getCorPorCargo(cargo)}">
                    <img src="${getIconePorCargo(cargo)}" alt="Icone">
                </div>
                <div class="pessoa-detalhes">
                    <h3>${nome}</h3>
                    <p class="email">${email}</p>
                    <div class="badges">
                        <span class="badge ${getCorPorCargo(cargo)}">${cargo.replace('_', ' ')}</span>
                        <span class="permissao">${getPermissaoPorCargo(cargo)}</span>
                    </div>
                </div>
            </div>
        `;

        if (cargo === 'diretor') {
            cardDiretor.innerHTML += htmlPessoa;
        } else if (cargo === 'coordenador') {
            cardCoordenador.innerHTML += htmlPessoa;
        } else if (cargo === 'administrador' || cargo === 'administrador_instituicao') {
            cardAdministrador.innerHTML += htmlPessoa;
        }
    });
}

function getCorPorCargo(cargo) {
    if (cargo.includes('diretor')) return 'blue';
    if (cargo.includes('coordenador')) return 'purple';
    return 'green';
}

function getIconePorCargo(cargo) {
    if (cargo.includes('diretor')) return '../../assets/icons/icon-shield.svg';
    if (cargo.includes('coordenador')) return '../../assets/icons/icon-user.svg';
    return '../../assets/icons/icon-administrador.svg';
}

function getPermissaoPorCargo(cargo) {
    if (cargo.includes('diretor')) return 'Permissões Totais';
    if (cargo.includes('coordenador')) return 'Permissões Limitadas';
    return 'Permissões Administrativas';
}

function buscarInstituicao() {
    const urlParams = new URLSearchParams(window.location.search);
    const idInstituicao = urlParams.get('id');
    const url = `/administrador/getInstituicaoPorId?id=${idInstituicao}`;

    if (!idInstituicao) {
        console.error("ID da instituição não encontrado na URL");
        return;
    }

    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const nomeInstituicao = data.dados[0]?.instituicaoNome || "Sem nome";
            document.getElementById("nome_instituicao").textContent = nomeInstituicao;
            renderResponsaveis(data.dados);
        })
        .catch(error => {
            console.error("Erro ao buscar instituição: ", error);
            alert("Erro ao buscar instituição.")
        }); 
}

window.onload = buscarInstituicao;