window.abrirModalCadastroRegra = async function () {
    if (!window.regraKpis || !window.regraKpis.length) {
        await carregarKpis();
    }

    abrirModal({
        titulo: "Registrar Regras",
        conteudo: formCadastroRegra(),
        botoes: botoesCadastro("cadastrarRegra"),
        tamanho: "md",
        tipo: "default"
    });

    preencherKpis();
};

window.abrirModalEdicaoRegra = async function (id, classificacao, kpi, descricao, cor, inferior, superior) {
    if (!window.regraKpis || !window.regraKpis.length) {
        await carregarKpis();
    }

    abrirModal({
        titulo: "Editar Regras",
        conteudo: formEdicaoRegra(),
        botoes: botoesCadastro("atualizarRegra"),
        tamanho: "md",
        tipo: "warning"
    });

    preencherKpis();

    document.getElementById("edicao-regra-id").value = id;
    document.getElementById("edicao-classificacao").value = classificacao;
    document.getElementById("edicao-kpi").value = kpi;
    document.getElementById("edicao-limite_inferior").value = inferior;
    document.getElementById("edicao-limite_superior").value = superior;
    document.getElementById("edicao-descricao").value = descricao;
};

window.abrirModalDelecaoRegra = function (id) {
    abrirModal({
        titulo: "Excluir Regra",
        conteudo: formDelecaoRegra(),
        botoes: botoesExcluir("deletarRegra"),
        tamanho: "sm",
        tipo: "danger"
    });

    document.getElementById("delecao-regra-id").value = id;
};
