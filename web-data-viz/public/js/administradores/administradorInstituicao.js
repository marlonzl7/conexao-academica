async function kpi() {
    const idInstituicao = sessionStorage.getItem("ID_INSTITUICAO");

    console.log("ID:", idInstituicao);

    if (!idInstituicao) {
        console.error("ID não encontrado");
        return;
    }

    try {
        const response = await fetch(`/api/instituicao/kpis/${idInstituicao}`);
        const res = await response.json();

        const data = res.dados;

        document.getElementById('total_pessoas').textContent = data.totalPessoas || 0;
        document.getElementById('total_ativo').textContent = data.totalAtivo || 0;
        document.getElementById('total_diretor').textContent = data.totalDiretor || 0;

    } catch (error) {
        console.error("Erro:", error);
    }

}

window.onload = kpi;