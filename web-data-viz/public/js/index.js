var menu_header = document.getElementById("menu");

const imagens = [
  "./assets/icon/menu.png",
  "./assets/icon/botao-fechar.png",
  "./assets/icon/sobre-nos.png",
  "./assets/icon/contact-us.png",
  "./assets/icon/login.png",
  "./assets/icon/home.png",
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

var contador = 0;
var carrosel = document.querySelectorAll(".carrosel-card");

function atualizarCarrosel() {
  for (let index = 0; index < carrosel.length; index++) {
    carrosel[index].style.display = "none"; 
  }
  carrosel[contador].style.display = "block";
}

function proximo() {
  contador++;
  if (contador > carrosel.length - 1) {
    contador = 0;
  }
  atualizarCarrosel();
}

function anterior() {
  contador--;
  if (contador < 0) {
    contador = carrosel.length - 1;
  }
  atualizarCarrosel();
}

window.addEventListener("resize", resTablet);

atualizarCarrosel();