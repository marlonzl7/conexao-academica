var menu_header = document.getElementById("menu");

const imagens = [
  "/assets/icons/menu.png",
  "/assets/icons/botao-fechar.png",
  "/assets/icons/sobre-nos.png",
  "/assets/icons/contact-us.png",
  "/assets/icons/login.png",
  "/assets/icons/home.png",
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

function enviarMensagem() {
  const nome = document.getElementById("name");
  const email = document.getElementById("email");
  const mensagem = document.getElementById("message");

  const btn = document.querySelector("#contact-form button")
  const textoOriginal = btn.innerText;

  if(!validarNome(nome)){
    console.error('Erro no envio da mensagem devido ao nome!');
    alert('Erro ao enviar mensagem, verifique seu nome!');
    return;
  }
  if(!validarEmail(email)){
    console.error('Erro no envio da mensagem devido ao email!');
    alert('Erro ao enviar mensagem, verifique seu email!');
    return;
  }
  if(!validarMensagem(mensagem)){
    console.error('Erro no envio da mensagem devido a mensagem digiada!');
    console.log('Erro ao enviar mensagem, verifique sua mensagem digitada!');
    return;
  }

  btn.innerText = "Enviando..."
  btn.disabled = true;

  fetch("/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nomeServer: nome.value,
      emailServer: email.value,
      mensagemServer: mensagem.value,
    }),
  })
    .then(function (respostaSucesso) {
      alert("Mensagem enviada com sucesso!", respostaSucesso);
      nome.value = "";
      email.value = "";
      mensagem.value = "";
    })
    .catch(function (RespostaErro) {
      console.error("Erro ao enviar mensagem:", RespostaErro);
      alert("Erro ao enviar mensagem. Por favor, tente novamente.");
    })
    .finally(() =>{
      btn.innerText = textoOriginal;
      btn.disabled = false;
    });

  return false;
}
