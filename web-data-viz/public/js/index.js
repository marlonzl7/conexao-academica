var menu_header = document.getElementById("menu");
var imagem_menu = document.getElementById("imagem-menu");
var imagem_sobreNos = document.getElementById("sobre-imagem");
var imagem_contactUs = document.getElementById("contato-imagem");
var imagem_login = document.getElementById("login-imagem");

const imagens = [
    './assets/icon/menu.png',
    './assets/icon/botao-fechar.png',
    './assets/icon/sobre-nos.png',
    './assets/icon/contact-us.png',
    './assets/icon/login.png'
];

function resTablet() {
    if (window.innerWidth >= 768) {
        menu_header.style.display = "";
    }
}

function menu() {
    if (menu_header.style.display === "block") {
        menu_header.style.display = "";
        imagem_menu.src = imagens[0];
    } else {
        menu_header.style.display = "block";
        imagem_menu.src = imagens[1];
        imagem_sobreNos.src = imagens[2];
        imagem_contactUs.src = imagens[3];
        imagem_login.src = imagens[4];
    }
}

window.addEventListener("resize", resTablet);
