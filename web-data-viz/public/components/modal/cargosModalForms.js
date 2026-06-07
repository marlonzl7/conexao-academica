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

    // Permite apenas letras e espaços
    input.value = input.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");

    // Remove espaços duplicados
    input.value = input.value.replace(/\s+/g, " ");

    const valor = input.value.trim();

    const erro = input.id === "inputNovo"
        ? document.getElementById("erroNovo")
        : document.getElementById("erroEditar");

    if (!valor) {
        erro.textContent = "O nome do cargo é obrigatório.";
        return false;
    }

    if (valor.length < 3) {
        erro.textContent = "Digite pelo menos 3 letras.";
        return false;
    }

    if (valor.length > 50) {
        erro.textContent = "Máximo de 50 caracteres.";
        return false;
    }

    erro.textContent = "";
    return true;
}

function salvarCargo() {

    const input = document.getElementById("inputNovo");

    if (!input) {
        console.error("Input não encontrado.");
        return;
    }

    if (!validarCargo(input)) {
        console.log("Validação falhou.");
        return;
    }

    const nomeCargo = input.value.trim();

    console.log("Cargo salvo:", nomeCargo);

    // Chamar API aqui
    // cadastrarCargo(nomeCargo);
}