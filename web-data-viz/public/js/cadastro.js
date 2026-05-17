document.addEventListener("DOMContentLoaded", () => {
    iniciar();
});

function iniciar() {
    const instituicaoInput = document.getElementById("instituicao");
    const cpfInput = document.getElementById("cpf");
    const nomeInput = document.getElementById("nome");
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");
    const confirmarSenhaInput = document.getElementById("confirmarSenha");
    const btnCadastro = document.getElementById("btn-cadastro");
    const btnLogin = document.getElementById("link-login");

    let mapaInstituicoes = {};

    let timerInstituicao;

    instituicaoInput.addEventListener("input", () => {
        clearTimeout(timerInstituicao);
        timerInstituicao = setTimeout(() => {
            buscarInstituicoes();
        }, 300);
    });

    cpfInput.addEventListener("input", () => {
        validarCampo(
            "cpfInvalido",
            "CPF inválido: deve estar no formato 000.000.000-00",
            validarCPF,
            cpfInput
        );
    });

    nomeInput.addEventListener("input", () => {
        validarCampo(
            "nomeInvalido",
            "Nome inválido: deve ter no mínimo 3 caracteres e só conter letras",
            validarNome,
            nomeInput
        );
    });

    emailInput.addEventListener("input", () => {
        validarCampo(
            "emailInvalido",
            "Email inválido: deve seguir o formato 'exemplo@email.com'",
            validarEmail,
            emailInput
        );
    });

    senhaInput.addEventListener("input", () => {
        validarCampo(
            "senhaInvalida",
            "Senha inválida: Deve ter no mínimo 8 caracteres, maiúsculas, minúsculas, números e caracteres especiais",
            validarSenha,
            senhaInput
        );

        confirmarSenhaInput.dispatchEvent(new Event("input"));
    });

    confirmarSenhaInput.addEventListener("input", () => {
        validarCampo(
            "confirmarSenhaInvalida",
            "Senha inválida: Senhas não coincidem",
            validarConfirmacaoSenha,
            senhaInput,
            confirmarSenhaInput
        );
    });

    btnLogin.addEventListener("click", () => {
        window.location.href = "login.html"
    });

    btnCadastro.addEventListener("click", cadastrar);

    async function buscarInstituicoes() {
        const termo = instituicaoInput.value;

        console.log(termo);

        if (termo.length < 2) return;

        const resposta = await fetch(`/instituicoes?busca=${termo}`);
        const resJson = await resposta.json();

        const instituicoes = Array.isArray(resJson) ? resJson : resJson.dados;

        const datalist = document.getElementById("instituicoes");
        datalist.innerHTML = "";

        mapaInstituicoes = {};

        instituicoes.forEach(inst => {
            const option = document.createElement("option");
            option.value = inst.nome;

            datalist.appendChild(option);

            mapaInstituicoes[inst.nome] = inst.id_instituicao;
        });
    }

    function validarCampo(spanId, mensagemErro, funcValidacao, ...parametros) {
        const erroSpan = document.getElementById(spanId);
        const divErro = erroSpan.parentElement;

        if (!funcValidacao(...parametros)) {
            erroSpan.textContent = mensagemErro;
            divErro.classList.add("ativo");
        } else {
            erroSpan.textContent = "";
            divErro.classList.remove("ativo");
        }
    }

    async function cadastrar() {
        if (
            validarCPF(cpfInput) &&
            validarNome(nomeInput) &&
            validarEmail(emailInput) &&
            validarSenha(senhaInput) &&
            validarConfirmacaoSenha(senhaInput, confirmarSenhaInput)
        ) {
            const url = '/usuarios/administrador-instituicao';

            const nomeInstituicao = instituicaoInput.value;
            const idInstituicao = mapaInstituicoes[nomeInstituicao];

            if (!idInstituicao) {
                alert("Selecione uma instituição válida");
                return;
            }

            const dados = {
                idInstituicao: idInstituicao,
                cpf: cpfInput.value,
                nome: nomeInput.value,
                email: emailInput.value,
                senha: senhaInput.value,
                confirmacaoSenha: confirmarSenhaInput.value
            }

            try {
                const res = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dados)
                });

                const resposta = await res.json();

                if (!res.ok) {
                    alert(resposta.mensagem || "Erro ao realizar cadastro");
                    return;
                }

                const popup = document.getElementById("popup-overlay");
                const btnOk = document.getElementById("btn-popup-ok");

                popup.classList.add("ativo");
                btnOk.addEventListener("click", () => {
                    window.location.href = "login.html";
                });
            } catch (erro) {
                console.error(erro);
                alert("Erro ao conectar com o servidor");
            }
        } else {
            alert("Verifique se todos os campos estão válidos e tente novamente");
        }
    }
}