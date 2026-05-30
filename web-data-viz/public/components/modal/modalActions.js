window.abrirModalDiretor = async function () {

    abrirModal({

        titulo: "Cadastrar Diretor",

        conteudo: formDiretor(),

        botoes: botoesCadastro(
            "cadastrarDiretor"
        ),

        tamanho: "md",

        tipo: "default"
    });
};

window.abrirModalCoordenador = async function () {

    abrirModal({

        titulo: "Cadastrar Coordenador",

        conteudo: formCoordenador(),

        botoes: botoesCadastro(
            "cadastrarCoordenador"
        ),

        tamanho: "md",

        tipo: "default"
    });

    await listarCursos();
};

window.abrirModalAdministrador = async function () {

    abrirModal({

        titulo: "Cadastrar Administrador",

        conteudo: formAdministrador(),

        botoes: botoesCadastro(
            "cadastrarAdministrador"
        ),

        tamanho: "md",

        tipo: "default"
    });

    await listarCursos();
};