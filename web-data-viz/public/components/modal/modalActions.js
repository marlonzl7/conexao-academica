window.abrirModalDiretor = function () {

    abrirModal({

        titulo: "Cadastrar Diretor",

        conteudo: formDiretor(),

        botoes: `
            <button
                class="modal-botao-cancelar"
                onclick="fecharModal()">

                Cancelar
            </button>

            <button
                class="modal-botao-confirmar"
                onclick="cadastrarDiretor()">

                Cadastrar
            </button>
        `
    });
}

window.abrirModalCoordenador = async function () {

    abrirModal({

        titulo: "Cadastrar Coordenador",

        conteudo: formCoordenador(),

        botoes: `
            <button
                class="modal-botao-cancelar"
                onclick="fecharModal()">

                Cancelar
            </button>

            <button
                class="modal-botao-confirmar"
                onclick="cadastrarCoordenador()">

                Cadastrar
            </button>
        `
    });

    await listarCursos();
}

window.abrirModalAdministrador = async function () {

    abrirModal({

        titulo: "Cadastrar Administrador",

        conteudo: formAdministrador(),

        botoes: `
            <button
                class="modal-botao-cancelar"
                onclick="fecharModal()">

                Cancelar
            </button>

            <button
                class="modal-botao-confirmar"
                onclick="cadastrarAdministrador()">

                Cadastrar
            </button>
        `
    });

    await listarCursos();
}