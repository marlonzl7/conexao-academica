async function loadComponent(id, file) {
    const response = await fetch(file);
    const html = await response.text();
    document.getElementById(id).innerHTML = html;
}


async function initPage(title) {
    await loadComponent("sidebar-container", "../components/sidebar.html");
    await loadComponent("header-container", "../components/header.html");

    const pageTitle = document.getElementById("page-title");

    if (pageTitle) {
        pageTitle.textContent = title;
    }
}