window.formNovoCargo = function () {
    return `
        <div class="form-group">

            <label>Nome do Cargo</label>

            <input 
                type="text"
                id="inputNovo"
                placeholder="Digite o nome do cargo"
                maxlength="50"
                oninput="validarCargo(this)"
            >

            <span class="erro-validacao" id="erroNovo"></span>

        </div>
    `;
};

window.formEditarCargo = function (nome) {
    return `
        <div class="form-group">

            <label>Nome do Cargo</label>

            <input 
                type="text"
                id="inputEditar"
                value="${nome}"
                placeholder="Digite o nome do cargo"
                maxlength="50"
                oninput="validarCargo(this)"
            >

            <span class="erro-validacao" id="erroEditar"></span>

        </div>
    `;
};

function validarCargo(input) {

   
    input.value = input.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");

   
    input.value = input.value.replace(/\s{2,}/g, " ");

    const valor = input.value.trim();

    const erro = input.id === "inputNovo"
        ? document.getElementById("erroNovo")
        : document.getElementById("erroEditar");

   
    if (valor.length === 0) {
        erro.innerHTML = "O nome do cargo é obrigatório.";
        return false;
    }

  
    if (valor.length < 3) {
        erro.innerHTML = "Digite pelo menos 3 letras.";
        return false;
    }

    if (valor.length > 50) {
        erro.innerHTML = "Máximo de 50 caracteres.";
        return false;
    }

    erro.innerHTML = "";

    return true;
}

function salvarCargo() {

    const input = document.getElementById("inputNovo");

    const valido = validarCargo(input);


    if (!valido) {
        return;
    }

    const nomeCargo = input.value.trim();

    console.log("Cargo salvo:", nomeCargo);

}