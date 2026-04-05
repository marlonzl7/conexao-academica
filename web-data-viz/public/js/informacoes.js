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
    const idUsuario = 11; // depois vamos melhorar isso

    const senhaAtual = document.getElementById("senhaAtual").value;
    const novaSenha = document.getElementById("novaSenha").value;

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
            alert("Senha atualizada com sucesso!");
        } else {
            alert(resposta.mensagem);
        }
    })
    .catch(erro => {
        console.error("Erro:", erro);
    });
}