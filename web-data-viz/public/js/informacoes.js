window.onload = function () {
    buscarDados();
};

function formatarCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function buscarDados() {
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

    // envio para o backend
    fetch(`/usuarios/${idUsuario}/senha`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            senhaAtual,
            novaSenha
        })
    })
    .then(res => res.json())
    .then(resposta => {
        if (resposta.sucesso) {
            mensagem.style.color = "green";
            mensagem.innerText = "Senha atualizada com sucesso!";

            document.getElementById("senhaAtual").value = "";
            document.getElementById("novaSenha").value = "";
            document.getElementById("confirmarSenha").value = "";
        } else {
            mensagem.style.color = "red";
            mensagem.innerText = resposta.mensagem;
        }
    })
    .catch(erro => {
        console.error("Erro:", erro);
        mensagem.innerText = "Erro ao atualizar senha.";
    });
}