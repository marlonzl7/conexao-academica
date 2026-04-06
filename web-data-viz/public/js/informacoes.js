window.onload = function () {
    buscarDados();
    carregarDados();
};

function formatarCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function buscarDados() {
    /*const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        console.error("Usuário não está logado");
        return;
    }*/

    //const idUsuario = usuario.id_usuario;
    const idUsuario = 11;

    fetch(`/usuarios/${idUsuario}`)
        .then(res => res.json())
        .then(resposta => {
            if (!resposta.sucesso) {
                console.error(resposta.mensagem);
                return;
            }

            const dados = resposta.dados;

            document.getElementById("instituicao").innerText = dados.instituicao;
            document.getElementById("cpf").innerText = formatarCPF(dados.cpf);
            document.getElementById("nome").innerText = dados.nome;
            document.getElementById("email").innerText = dados.email;
        })
        .catch(erro => {
            console.error("Erro ao buscar dados:", erro);
        });
}


function alterarSenha() {
    /*const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        alert("Usuário não está logado");
        return;
    }*/

    //const idUsuario = usuario.id_usuario;
    const idUsuario = 11;

    const senhaAtual = document.getElementById("senhaAtual").value;
    const novaSenha = document.getElementById("novaSenha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    const mensagem = document.getElementById("mensagem");

    mensagem.innerText = "";

    // validações
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
        mensagem.innerText = "Preencha todos os campos!";
        return;
    }

    if (novaSenha.length < 8) {
        mensagem.innerText = "A nova senha deve ter pelo menos 8 caracteres.";
        return;
    }

    if (novaSenha === senhaAtual) {
        mensagem.innerText = "A nova senha deve ser diferente da atual.";
        return;
    }

    if (novaSenha !== confirmarSenha) {
        mensagem.innerText = "As senhas não coincidem.";
        return;
    }
}

function carregarDados() {
    //const usuario = JSON.parse(localStorage.getItem("usuario"));
    const idUsuario = 11;

    fetch(`/usuarios/${idUsuario}`)
        .then(res => res.json())
        .then(resposta => {
            if (!resposta.sucesso) return;

            const dados = resposta.dados;

            document.getElementById("instituicao").value = dados.instituicao;
            document.getElementById("nome").value = dados.nome;
            document.getElementById("email").value = dados.email;
        });
}

function salvar(event) {
    event.preventDefault(); 

    //const usuario = JSON.parse(localStorage.getItem("usuario"));
    const idUsuario = 11;

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;

    // validações
    if (!nome || !email) {
        alert("Preencha todos os campos!");
        return;
    }

    fetch(`/usuarios/${idUsuario}`, { 
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome,
            email
        })
    })
    .then(res => res.json())
    .then(resposta => {
        if (resposta.sucesso) {
            alert("Dados atualizados com sucesso!");

            window.location.href = "informacoes-da-conta.html";
        } else {
            alert(resposta.mensagem);
        }
    })
    .catch(erro => {
        console.error(erro);
        alert("Erro ao atualizar");
    });
}


