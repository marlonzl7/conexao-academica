function mostrarSenha() {
    const input = document.getElementById("senha");
    const icone = document.querySelector(".olho-senha");

    if (input.type === "password") {
        input.type = "text";
        icone.src = "/assets/icons/show-icon-azul.png";
        icone.alt = "Ocultar senha";
    } else {
        input.type = "password";
        icone.src = "/assets/icons/hide-icon-azul.png";
        icone.alt = "Mostrar senha";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");
    const btnEntrar = document.getElementById("btn-entrar");

    emailInput.addEventListener("input", () => {
        const erroSpan = document.getElementById("emailInvalido");
        const divErro = erroSpan.parentElement;

        if (!validarEmail(emailInput)) {
            erroSpan.textContent = "Email inválido: deve seguir o formato 'exemplo@email.com'";
            divErro.classList.add("ativo");
        } else {
            erroSpan.textContent = "";
            divErro.classList.remove("ativo");
        }
    });

    senhaInput.addEventListener("input", () => {
        const erroSpan = document.getElementById("senhaInvalida");
        const divErro = erroSpan.parentElement;

        if (!senhaInput.value.trim()) {
            erroSpan.textContent = "Preencha o campo Senha";
            divErro.classList.add("ativo");
        } else {
            erroSpan.textContent = "";
            divErro.classList.remove("ativo");
        }
    });

    btnEntrar.addEventListener("click", login);
});

async function login() {
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");
    const erroEmailSpan = document.getElementById("emailInvalido");
    const erroSenhaSpan = document.getElementById("senhaInvalida");

    let valido = true;

    if (!validarEmail(emailInput)) {
        erroEmailSpan.textContent = "Email inválido: deve seguir o formato 'exemplo@email.com'";
        erroEmailSpan.parentElement.classList.add("ativo");
        valido = false;
    }

    if (!senhaInput.value.trim()) {
        erroSenhaSpan.textContent = "Preencha o campo Senha";
        erroSenhaSpan.parentElement.classList.add("ativo");
        valido = false;
    }

    if (!valido) return;

    try {
        const resposta = await fetch("/usuarios/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: emailInput.value.trim(),
                senha: senhaInput.value.trim()
            })
        });

        const json = await resposta.json();

        if (!resposta.ok) {
            erroSenhaSpan.textContent = json.mensagem || "Credenciais inválidas";
            erroSenhaSpan.parentElement.classList.add("ativo");
            return;
        }

        iniciarSessao(json.dados);
        redirecionarPorCargo(json.dados.cargo);

    } catch (erro) {
        console.error(erro);
        erroSenhaSpan.textContent = "Erro ao conectar com o servidor";
        erroSenhaSpan.parentElement.classList.add("ativo");
    }
}

function iniciarSessao(usuario) {
    sessionStorage.ID_USUARIO = usuario.id_usuario;
    sessionStorage.NOME_USUARIO = usuario.nome;
    sessionStorage.EMAIL_USUARIO = usuario.email;
    sessionStorage.CARGO_USUARIO = usuario.cargo;
    sessionStorage.ID_INSTITUICAO = usuario.id_instituicao || "";
    sessionStorage.ID_CURSO = usuario.id_curso || "";
    sessionStorage.USUARIO = JSON.stringify(usuario);
    sessionStorage.setItem("layout", usuario.cargo);
}

function redirecionarPorCargo(cargo) {
    switch (cargo) {
        case "administrador_sistema":
            window.location.href = "/pages/administradores/administradorConexao.html";
            break;
        case "administrador_instituicao":
            window.location.href = "/pages/administradores/administradorInstituicao.html";
            break;
        case "diretor":
            window.location.href = "/pages/dashboards/diretor.html";
            break;
        case "coordenador":
            window.location.href = "/pages/dashboards/coordenador.html";
            break;
        default:
            window.location.href = "/pages/index.html";
    }
}