const idInstituicao = sessionStorage.getItem("ID_INSTITUICAO");

async function kpi() {
  if (!idInstituicao) {
    console.error("ID não encontrado");
    return;
  }

  const url = `/administrador/${idInstituicao}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const nomeInstituicao =
        data.instituicao?.instituicaoNome ||
        data.dados?.[0]?.instituicaoNome ||
        "Sem nome";

      document.getElementById("nome_instituicao").textContent = nomeInstituicao;
    })
    .catch((error) => {
      console.error("Erro ao buscar instituição: ", error);
      alert("Erro ao buscar instituição.");
    });

  try {
    const response = await fetch(
      `/administrador/instituicao/kpis/${idInstituicao}`,
    );
    const res = await response.json();

    const data = res.dados;

    document.getElementById("total_pessoas").textContent =
      data.totalPessoas || 0;
    document.getElementById("total_ativo").textContent = data.totalAtivo || 0;
    document.getElementById("total_diretor").textContent =
      data.totalDiretor || 0;
  } catch (error) {
    console.error("Erro:", error);
  }
}

async function acessar() {
  window.location.href = `/pages/administradores/administradorDetalhes.html?id=${idInstituicao}`;
}

window.onload = kpi;
