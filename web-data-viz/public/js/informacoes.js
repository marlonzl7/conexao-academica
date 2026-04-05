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