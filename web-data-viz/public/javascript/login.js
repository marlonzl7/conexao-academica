//validação de mostrar e ocultar senha
function mostrarSenha(idInput, icone) {
    const input = document.getElementById(idInput);

    if (input.type === "password") {
        input.type = "text";
    icone.src = "./img/olho_aberto.png";
        icone.alt = "Ocultar senha";
    } else {
        input.type = "password";
       icone.src = "./img/olho_fechado.png";
        icone.alt = "Mostrar senha";
    }
}

//validação email 
function onkey_email() {
    email = ipt_email.value.trim(); //.trim é para tirar todos os espaços em branco
    
    let erro = "";

    if (email == '') {
        erro = `Preencha o campo Email`;
    } else if (email.indexOf("@") == -1) {
        erro = `Insira um email válido que contenha @`;
    }

    if (erro != "") {
        div_msg_email.innerHTML = `${erro}`;
    } else {
        div_msg_email.innerHTML = ``;
    }
}

//validação senha

function onkey_senha() {
    senha = ipt_senha.value.trim();
    let erro = "";

    if (senha == '') {
        erro = `Preencha o campo Senha`;
    } else if (senha.indexOf("0") == -1 && senha.indexOf("1") == -1 && senha.indexOf("2") == -1 &&
        senha.indexOf("3") == -1 && senha.indexOf("4") == -1 && senha.indexOf("5") == -1 &&
        senha.indexOf("6") == -1 && senha.indexOf("7") == -1 && senha.indexOf("8") == -1 &&
        senha.indexOf("9") == -1) {
        erro = 'A senha deve conter pelo menos um número!';
    }

    if (erro != "") {
        div_msg_senha.innerHTML = `${erro}`;
    } else {
        div_msg_senha.innerHTML = ``;
    }
}

//Validação login 

function entrar() {
    email = ipt_email.value;
    senha = ipt_senha.value;

    if (email || senha == '') {
        div_msg_login.innerHTML = "Por favor, preencha todos os campos."
    }
 
}

// Header responsivo
var menu_header = document.getElementById("menu");

const imagens = [
  "img/menu.png",
  "img/botao-fechar.png",
  "img/sobre-nos.png",
  "img/contact-us.png",
  "img/login.png",
  "img/home.png",
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