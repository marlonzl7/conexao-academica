window.onload = function () {

    const path = window.location.pathname;
    if (path.includes("informacoes-da-conta.html")) {
        buscarDados();
    } else if (path.includes("editar-informacoes.html")) {
        carregarDados();
    }
};

function formatarCPF(cpf) {
    if (!cpf) return "N/A";
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function buscarDados() {
    const usuarioStr = localStorage.getItem("usuario");
    if (!usuarioStr) return console.error("Usuário não logado");

    const usuario = JSON.parse(usuarioStr);
    const idUsuario = usuario.id_usuario;

    fetch(`/usuarios/${idUsuario}`)
        .then(res => res.json())
        .then(resposta => {
            if (!resposta.sucesso) return console.error(resposta.mensagem);

            const dados = resposta.dados;
            if(document.getElementById("instituicao")) document.getElementById("instituicao").innerText = dados.instituicao || "Não informada";
            if(document.getElementById("cpf")) document.getElementById("cpf").innerText = formatarCPF(dados.cpf);
            if(document.getElementById("nome")) document.getElementById("nome").innerText = dados.nome;
            if(document.getElementById("email")) document.getElementById("email").innerText = dados.email;
        })
        .catch(erro => console.error("Erro ao buscar dados:", erro));
}

function carregarDados() {
    const usuarioStr = localStorage.getItem("usuario");
    if (!usuarioStr) return;

    const usuario = JSON.parse(usuarioStr);
    const idUsuario = usuario.id_usuario;

    fetch(`/usuarios/${idUsuario}`)
        .then(res => res.json())
        .then(resposta => {
            if (!resposta.sucesso) return;

            const dados = resposta.dados;
         
            if(document.getElementById("instituicao")) document.getElementById("instituicao").value = dados.instituicao || "";
            if(document.getElementById("nome")) document.getElementById("nome").value = dados.nome;
            if(document.getElementById("email")) document.getElementById("email").value = dados.email;
        });
}

function salvar(event) {
    event.preventDefault(); 

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const idUsuario = usuario.id_usuario;

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;

    if (!nome || !email) {
        alert("Preencha todos os campos!");
        return;
    }

    fetch(`/usuarios/${idUsuario}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email })
    })
    .then(res => res.json())
    .then(resposta => {
        if (resposta.sucesso) {
            alert("Dados atualizados com sucesso!");
    
            usuario.nome = nome;
            usuario.email = email;
            localStorage.setItem("usuario", JSON.stringify(usuario));
            
            window.location.href = "informacoes-da-conta.html";
        } else {
            alert(resposta.mensagem);
        }
    })
    .catch(erro => alert("Erro ao atualizar"));
}

function alterarSenha() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const idUsuario = usuario.id_usuario;

    const senhaAtual = document.getElementById("senhaAtual").value;
    const novaSenha = document.getElementById("novaSenha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;
    const mensagem = document.getElementById("mensagem");

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
        mensagem.innerText = "Preencha todos os campos!";
        return;
    }

    if (novaSenha !== confirmarSenha) {
        mensagem.innerText = "As senhas não coincidem.";
        return;
    }

    fetch(`/usuarios/${idUsuario}/senha`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senhaAtual, novaSenha })
    })
    .then(res => res.json())
    .then(resposta => {
        if (resposta.sucesso) {
            alert("Senha alterada com sucesso!");
            window.location.href = "informacoes-da-conta.html";
        } else {
            mensagem.innerText = resposta.mensagem;
        }
    })
    .catch(() => { mensagem.innerText = "Erro ao conectar com o servidor."; });
}