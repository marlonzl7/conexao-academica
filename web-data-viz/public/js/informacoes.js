const STORAGE_USER_KEY = "USUARIO";

window.onload = function () {

    const path = window.location.pathname;
    if (path.includes("informacoes-da-conta.html")) {
        buscarDados();
    } else if (path.includes("editar-informacoes.html")) {
        carregarDados();
    }
};

function obterUsuarioSessao() {
    const usuarioStr = sessionStorage.getItem(STORAGE_USER_KEY);

    if (!usuarioStr) {
        return null;
    }

    try {
        return JSON.parse(usuarioStr);
    } catch (erro) {
        console.error("Erro ao interpretar usuário da sessão:", erro);
        return null;
    }
}

function formatarCPF(cpf) {
    if (!cpf) return "N/A";
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function buscarDados() {
    const usuario = obterUsuarioSessao();

    if (!usuario) return;

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
    const usuario = obterUsuarioSessao();

    if (!usuario) return;

    const idUsuario = usuario.id_usuario;

    fetch(`/usuarios/${idUsuario}`)
        .then(res => res.json())
        .then(resposta => {
            if (!resposta.sucesso) return;

            const dados = resposta.dados;
         
            if(document.getElementById("instituicao")) document.getElementById("instituicao").value = dados.instituicao || "";
            if(document.getElementById("nome")) document.getElementById("nome").value = dados.nome;
            if(document.getElementById("email")) document.getElementById("email").value = dados.email;
        })
        .catch(erro => {
            console.error("Erro ao carregar dados:", erro);
        });
}

function salvar(event) {
    event.preventDefault(); 

    const usuario = obterUsuarioSessao();

    if (!usuario) {
        showToast("danger", "Usuário não encontrado", "Usuário não foi encontrado na sessão.");
        return;
    }

    const idUsuario = usuario.id_usuario;

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;

    if (!nome || !email) {
        showToast("danger", "Preencha todos os campos", "Preencha todos os campos obrigatórios.");
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
            showToast("sucess", "Dados atualizados com sucesso", "Os dados foram atualizados com sucesso.");
    
            usuario.nome = nome;
            usuario.email = email;
            sessionStorage.setItem(STORAGE_USER_KEY, JSON.stringify(usuario));
            
            window.location.href = "informacoes-da-conta.html";
        } else {
            alert(resposta.mensagem);
        }
    })
    .catch(erro => alert("Erro ao atualizar"));
}

function alterarSenha() {
    const usuario = obterUsuarioSessao();

    if (!usuario) {
        showToast("danger", "Usuário não encontrado", "Usuário não foi encontrado na sessão.");
        return;
    }

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
            showToast("sucess", "Senha alterada com sucesso", "A senha foi alterada com sucesso.");
            window.location.href = "informacoes-da-conta.html";
        } else {
            mensagem.innerText = resposta.mensagem;
        }
    })
    .catch(() => { mensagem.innerText = "Erro ao conectar com o servidor."; });
}

function confirmarExclusao() {
    const usuario = obterUsuarioSessao();

    if (!usuario) {
        showToast("danger", "Usuário não encontrado", "Usuário não foi encontrado na sessão.");
        return;
    }

    const idUsuario = usuario.id_usuario;

    
    if (confirm("Tem certeza que deseja excluir sua conta? Esta ação é permanente e você perderá acesso ao sistema.")) {
        
        fetch(`/usuarios/${idUsuario}`, {
            method: "DELETE", 
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(resposta => {
            if (resposta.sucesso) {
                showToast("sucess", "Sua conta foi excluída", "Sua conta foi excluída com sucesso.");
                
                sessionStorage.clear();
                
                window.location.href = "login.html";
            } else {
                showToast("danger", "Erro ao excluir conta", resposta.mensagem);
            }
        })
        .catch(erro => {
            console.error("Erro na requisição:", erro);
            showToast("danger", "Erro ao conectar com servidor", "Houve um erro ao tentar se conectar com o servidor.")
        });
    }
}