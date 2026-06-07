async function loadComponent(id, file) {
    const response = await fetch(file);
    const html = await response.text();
    document.getElementById(id).innerHTML = html;

    const usernameEl = document.getElementById("header-username");
    const nome = sessionStorage.getItem("NOME_USUARIO");
    if (usernameEl) usernameEl.textContent = nome || "Usuário"
}


async function initPage(title) {
    document.title = title;

    const params = new URLSearchParams(window.location.search);
    let layout = params.get("layout");

    if (!layout) {
        layout = sessionStorage.getItem("layout");
    }

    console.log("Layout:", layout);

    let sidebar = "";
    let header = "";

    switch (layout) {

        case "diretor":
            sidebar = "/components/sidebars/sidebar-diretor.html";
            header = "/components/headers/header-diretor.html";
            break;

        case "coordenador":
            sidebar = "/components/sidebars/sidebar-coordenador.html";
            header = "/components/headers/header-coordenador.html";
            break;

        case "administrador_instituicao":
            sidebar = "/components/sidebars/sidebar-admInstituicao.html";
            header = "/components/headers/header-admInstituicao.html";
            break;

        case "administrador_sistema":
            sidebar = "/components/sidebars/sidebar-admConexao.html";
            header = "/components/headers/header-admConexao.html";
            break;

        default:
            console.error("Cargo inválido");
            return;
    }

    await loadComponent("sidebar-container", sidebar);
    await loadComponent("header-container", header);

    carregarNomeUsuario();
}

function sair() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/pages/login.html";
}

function carregarNomeUsuario() {
    const usuarioStr = localStorage.getItem("usuario");
    if (!usuarioStr) return;

    const usuario = JSON.parse(usuarioStr);
    const span = document.getElementById("header-username");
    if (span) span.innerText = usuario.nome;
}