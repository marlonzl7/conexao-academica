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
    email = ipt_email.value.trim();
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

