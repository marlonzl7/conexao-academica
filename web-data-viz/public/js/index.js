var menu_header = document.getElementById("menu");
var imagem_menu = document.getElementById("imagem-menu");

const imagens = [
    './assets/icon/menu.png',
    './assets/icon/botao-fechar.png'
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
        }
}

window.addEventListener("resize", resTablet);
