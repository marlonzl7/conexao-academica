async function loadComponent(id, file) {
    const response = await fetch(file);
    const html = await response.text();
    document.getElementById(id).innerHTML = html;
}


async function initPage(title) {
    await loadComponent("sidebar-container", "../../components/sidebar.html");
    await loadComponent("header-container", "../../components/header.html");

    const pageTitle = document.getElementById("page-title");

    if (pageTitle) {
        pageTitle.textContent = title;
    }

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