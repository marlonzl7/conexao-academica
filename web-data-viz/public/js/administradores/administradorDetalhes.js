async function renderResponsaveis(dados) {
    const cardDiretor = document.getElementById("card_diretor");
    const cardCoordenador = document.getElementById("card_coordenador");
    const cardAdministrador = document.getElementById("card_administrador");

    if (cardDiretor) cardDiretor.innerHTML = "";
    if (cardCoordenador) cardCoordenador.innerHTML = "";
    if (cardAdministrador) cardAdministrador.innerHTML = "";

    const listaPessoas = Array.isArray(dados) ? dados : [dados];

    listaPessoas.forEach(pessoa => {
        const nome = pessoa.nomePessoa || "Não atribuído";
        const email = pessoa.emailPessoa || "N/A";
        const cargo = (pessoa.cargoNome || "").toLowerCase().trim();

        const estaAtivo = pessoa.usuarioAtivo === 1;

        const htmlPessoa = `
<div class="pessoa-card">

    <div class="pessoa-info">
        <div class="avatar-box ${getCorPorCargo(cargo)}">
            <img src="${getIconePorCargo(cargo)}" alt="Icone">
        </div>

        <div class="pessoa-detalhes">
            <h3>${nome}</h3>
            <p class="email">${email}</p>

            <div class="badges">
                <span class="badge ${getCorPorCargo(cargo)}">
                    ${cargo.replaceAll('_', ' ')}
                </span>
                <span class="permissao">
                    ${getPermissaoPorCargo(cargo)}
                </span>
            </div>
        </div>
    </div>

    <div class="acoes">
        <span class="toggle-label">
            ${estaAtivo ? 'Ativo' : 'Inativo'}
        </span>

        <label class="toggle-switch">
            <input 
                type="checkbox" 
                ${estaAtivo ? 'checked' : ''} 
                onchange="alterarStatus(${pessoa.id_usuario}, this.checked, this)"
            >
            <span class="toggle-slider"></span>
        </label>
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

async function alterarStatus(idUsuario, ativo, inputEl) {
    const urlParams = new URLSearchParams(window.location.search);
    const idInstituicao = urlParams.get('id');

    try {
        const response = await fetch(`/administrador/${idInstituicao}/usuarios/${idUsuario}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ativo })
        });

        const data = await response.json();

        if (data.sucesso) {
            const card = inputEl.closest('.pessoa-card');
            const label = card.querySelector('.toggle-label');
            if (label) label.textContent = ativo ? 'Ativo' : 'Inativo';
        }
    } catch (error) {
        console.error("Erro ao alterar status:", error);
        alert("Erro ao alterar status do usuário");
        inputEl.checked = !ativo;
    }
}

function cadastrarDiretor() {
    const urlParams = new URLSearchParams(window.location.search);
    const idInstituicao = urlParams.get('id');

    const nome = document.getElementById("diretor_nome").value.trim();
    const email = document.getElementById("diretor_email").value.trim();
    const senha = document.getElementById("diretor_senha").value.trim();
    const cpf = document.getElementById("diretor_cpf").value.trim();

    if (!nome || !email || !senha || !cpf) {
        alert("Todos os campos são obrigatórios.");
        return;
    }

    fetch(`/administrador/cadastrarDiretor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            idInstituicao,
            nome,
            email,
            senha,
            cpf
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.sucesso) {
                alert("Diretor cadastrado com sucesso!");
                fecharModal();
                buscarInstituicao();
            } else {
                alert("Erro ao cadastrar diretor: " + (data.mensagem || "Erro desconhecido"));
            }
        })
        .catch(error => {
            console.error("Erro ao cadastrar diretor:", error);
            alert("Erro ao cadastrar diretor.");
        });
}

function cadastrarCoordenador() {
    const urlParams = new URLSearchParams(window.location.search);
    const idInstituicao = urlParams.get('id');

    const nome = document.getElementById("coordenador_nome").value.trim();
    const email = document.getElementById("coordenador_email").value.trim();
    const senha = document.getElementById("coordenador_senha").value.trim();
    const cpf = document.getElementById("coordenador_cpf").value.trim();

    const id_curso = document.getElementById("select_curso").value;

    if (!nome || !email || !senha || !cpf || !id_curso) {
        alert("Todos os campos são obrigatórios.");
        return;
    }

    fetch(`/administrador/cadastrarCoordenador`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({
            id_curso,
            nome,
            email,
            senha,
            cpf
        })
    })

        .then(res => res.json())
        .then(data => {

            if (data.sucesso) {
                alert("Coordenador cadastrado com sucesso!");
                fecharModal();
                buscarInstituicao();
            } else {
                alert(
                    "Erro ao cadastrar Coordenador: " +
                    (data.mensagem || "Erro desconhecido")
                );
            }
        })

        .catch(error => {
            console.error("Erro ao cadastrar Coordenador:", error);
            alert("Erro ao cadastrar Coordenador.");
        });
}

function buscarInstituicao() {
    const urlParams = new URLSearchParams(window.location.search);
    const idInstituicao = urlParams.get('id');
    const url = `/administrador/${idInstituicao}`;

    if (!idInstituicao) {
        console.error("ID da instituição não encontrado na URL");
        return;
    }

    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const nomeInstituicao =
                data.instituicao?.instituicaoNome ||
                data.dados?.[0]?.nomeInstituicao ||
                "Sem nome";

            document.getElementById("nome_instituicao").textContent = nomeInstituicao;
            renderResponsaveis(data.dados);
        })
        .catch(error => {
            console.error("Erro ao buscar instituição: ", error);
            alert("Erro ao buscar instituição.")
        });
}

async function listarCursos() {
    const urlParams = new URLSearchParams(window.location.search);
    const idInstituicao = urlParams.get('id');

    try {
        const resposta = await fetch(
            `/administrador/cursos/${idInstituicao}`
        );

        const cursos = await resposta.json();
        console.log(cursos);
        const select = document.getElementById("select_curso");

        if (!select) {
            console.error("select_curso não encontrado");
            return;
        }

        select.innerHTML = `
            <option value="">
                Selecione um curso
            </option>
        `;

        cursos.forEach(curso => {
            select.insertAdjacentHTML(
                'beforeend',
                `
                <option value="${curso.id_curso}">
                    ${curso.nome}
                </option>
                `
            );
        });

    } catch (erro) {
        console.error("Erro ao listar cursos:", erro);
    }
}

window.onload = () => {
    buscarInstituicao();
    listarCursos();
};
