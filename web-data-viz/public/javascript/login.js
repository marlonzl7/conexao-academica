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
   