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
