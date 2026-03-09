var menu_header = document.getElementById("menu");

const imagens = [
    "./assets/icons/menu.png",
    "./assets/icons/botao-fechar.png",
    "./assets/icons/sobre-nos.png",
    "./assets/icons/contact-us.png",
    "./assets/icons/login.png",
    "./assets/icons/home.png",
];

function resTablet() {
    if (window.innerWidth >= 768) {
        menu_header.style.display = "";
    }
}

function menu() {
    var imagem_menu = document.getElementById("imagem-menu");
    var imagem_sobreNos = document.getElementById("sobre-imagem");
    var imagem_contactUs = document.getElementById("contato-imagem");
    var imagem_login = document.getElementById("login-imagem");
    var imagem_home = document.getElementById("home-imagem");

    if (menu_header.style.display === "block") {
        menu_header.style.display = "";
        imagem_menu.src = imagens[0];
    } else {
        menu_header.style.display = "block";
        imagem_menu.src = imagens[1];
        imagem_sobreNos.src = imagens[2];
        imagem_contactUs.src = imagens[3];
        imagem_login.src = imagens[4];
        imagem_home.src = imagens[5];
    }
}

window.addEventListener("resize", resTablet);