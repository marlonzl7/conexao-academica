const idInstituicao = sessionStorage.getItem("ID_INSTITUICAO");

async function carregarDados() {
  await getKPIs();
  await carregarGraficoRanking();
  await carregarGraficoEvasao();
}

async function carregarAnos() {
  try {
    const selectAnoInicio = document.getElementById("ano-inicio");
    const selectAnoFim = document.getElementById("ano-fim");

    const resposta = await fetch(
      `/dashboards/diretor/anos-disponiveis?idInstituicao=${idInstituicao}`,
    );

    selectAnoInicio.innerHTML = "";
    selectAnoFim.innerHTML = "";

    const response = await resposta.json();

    const anos = response.dados.anos;

    anos.forEach((item) => {
      const optionHTML = `<option value="${item.ano}">${item.ano}</option>`;
      selectAnoInicio.innerHTML += optionHTML;
      selectAnoFim.innerHTML += optionHTML;
    });

    if (anos.length > 0) {
      selectAnoInicio.value = anos[0].ano;
      selectAnoFim.value = anos[anos.length - 1].ano;
    }

    await carregarDados();
  } catch (erro) {
    console.error("Erro ao carregar anos disponíveis:", erro);
  }
}

async function buscarDados() {
  const anoInicio = document.getElementById("ano-inicio").value;
  const anoFim = document.getElementById("ano-fim").value;

  if (anoInicio && anoFim && anoInicio > anoFim) {
    showToast(
      "danger",
      "Filtragem por ano incorreta",
      "O ano de início deve ser menor ou igual ao ano de fim.",
    );
    return;
  }

  await carregarDados();
}

async function getKPIs() {
    const anoInicio = document.getElementById("ano-inicio").value;
    const anoFim = document.getElementById("ano-fim").value;
    console.log(idInstituicao);

    try {
        const response = await fetch(
            `/dashboards/diretor/kpis?anoInicio=${anoInicio}&anoFim=${anoFim}&idInstituicao=${idInstituicao}`
        );

        const responseData = await response.json();
        const dados = responseData.dados;

        if (!dados) return;

        const { kpis } = dados;

        document.getElementById("total-matriculas").textContent = kpis.matriculas.valor;
        document.getElementById("alunos-evadidos").textContent = kpis.evadidos.valor;
        document.getElementById("taxa-evasao").textContent = `${Number(kpis.taxaEvasao.valor).toFixed(2)}%`;
        document.getElementById("evasao-presencial-ead").textContent =
            `${kpis.evasaoPresencialEAD.presencial.toFixed(2)}% / ${kpis.evasaoPresencialEAD.ead.toFixed(2)}%`;

        preencherClassificacao("classificacao-total-matriculas", kpis.matriculas.classificacao);
        preencherClassificacao("classificacao-alunos-evadidos", kpis.evadidos.classificacao);
        preencherClassificacao("classificacao-taxa-evasao", kpis.taxaEvasao.classificacao);
        preencherClassificacao("classificacao-evasao-presencial-ead", kpis.evasaoPresencialEAD.classificacao);

    } catch (error) {
        console.error("Erro ao buscar KPIs:", error);
        ["total-matriculas", "alunos-evadidos", "taxa-evasao", "evasao-presencial-ead"]
            .forEach(id => document.getElementById(id).textContent = "N/A");
    }
}

function preencherClassificacao(elementoId, classificacao) {
    const el = document.getElementById(elementoId);
    if (!el) return;

    if (classificacao) {
        el.textContent = `${classificacao.nome} — ${classificacao.descricao}`;
        el.style.color = classificacao.cor;
    } else {
        el.textContent = "Sem classificação";
        el.style.color = "";
    }
}

function carregarGraficoRanking() {
  const anoInicio = document.getElementById("ano-inicio").value;
  const anoFim = document.getElementById("ano-fim").value;

  fetch(
    `/dashboards/diretor/graficos/top-3-maior-evasao?anoInicio=${anoInicio}&anoFim=${anoFim}&idInstituicao=${idInstituicao}`,
  )
    .then((response) => response.json())
    .then((responseData) => {
      console.log("Dados do gráfico de ranking:", responseData);

      const listaDados = responseData.dados || [];
      const anosUnicos = [
        ...new Set(listaDados.map((item) => item.anoEmissao)),
      ].sort();
      const cursosUnicos = [
        ...new Set(listaDados.map((item) => item.nomeCurso)),
      ];

      const chartExistente = Chart.getChart("chartRanking");
      if (chartExistente) {
        chartExistente.destroy();
      }

      const cores = ["#818cf8", "#f87171", "#34d399"];

      const datasetsFormatados = cursosUnicos
        .slice(0, 3)
        .map((curso, index) => {
          const dadosAlinhadosPorAno = anosUnicos.map((ano) => {
            const correspondencia = listaDados.find(
              (item) => item.nomeCurso === curso && item.anoEmissao === ano,
            );
            return correspondencia ? correspondencia.qtdDesvinculados : 0;
          });

          return {
            label: curso,
            data: dadosAlinhadosPorAno,
            backgroundColor: cores[index],
            stack: "stack0",
            borderRadius: 4,
          };
        });

      new Chart(document.getElementById("chartRanking"), {
        type: "bar",
        data: {
          labels: anosUnicos,
          datasets: datasetsFormatados,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              align: "center",
              labels: {
                usePointStyle: true,
                pointStyle: "circle",
                boxWidth: 8,
                font: { family: "Public Sans", size: 12 },
                color: "#6b7280",
                padding: 20,
              },
            },
            tooltip: {
              backgroundColor: "#1a1a2e",
              titleFont: { family: "Public Sans", size: 12 },
              bodyFont: { family: "Public Sans", size: 12 },
              padding: 10,
              cornerRadius: 8,
              mode: "index",
              intersect: false,
            },
          },
          scales: {
            x: {
              stacked: true,
              grid: { display: false },
              border: { display: false },
              ticks: {
                font: { family: "Public Sans", size: 12 },
                color: "#6b7280",
              },
            },
            y: {
              stacked: true,
              grid: { color: "#b3b3b3" },
              border: { display: false },
              ticks: {
                font: { family: "Public Sans", size: 11 },
                color: "#9ca3af",
                maxTicksLimit: 6,
              },
              beginAtZero: true,
            },
          },
        },
      });
    })
    .catch((error) => {
      console.error("Erro ao buscar dados do gráfico de ranking:", error);
    });
}

function carregarGraficoEvasao() {
  const anoInicio = document.getElementById("ano-inicio").value;
  const anoFim = document.getElementById("ano-fim").value;

  fetch(
    `/dashboards/diretor/graficos/taxa-evasao-anual?anoInicio=${anoInicio}&anoFim=${anoFim}&idInstituicao=${idInstituicao}`,
  )
    .then((response) => response.json())
    .then((responseData) => {
      console.log("Dados do gráfico tendência de evasão:", responseData);

      const listaDados = responseData.dados?.serie || [];

      const anosUnicos = [
        ...new Set(listaDados.map((item) => item.ano)),
      ].sort();

      const chartExistente = Chart.getChart("chartTrend");
      if (chartExistente) {
        chartExistente.destroy();
      }

      const matriculasAlinhadas = anosUnicos.map((ano) => {
        const registro = listaDados.find((item) => item.ano === ano);
        return registro ? Number(registro.matriculas) : 0;
      });

      const evadidosAlinhados = anosUnicos.map((ano) => {
        const registro = listaDados.find((item) => item.ano === ano);
        return registro ? Number(registro.evadidos) : 0;
      });

      const trancadosAlinhados = anosUnicos.map((ano) => {
        const registro = listaDados.find((item) => item.ano === ano);
        return registro ? Number(registro.trancados) : 0;
      });

      const tipoGrafico = anosUnicos.length === 1 ? "bar" : "line";
      const ehBarra = tipoGrafico === "bar";

      const datasetsFormatados = [
        {
          label: "Matrículas",
          data: matriculasAlinhadas,
          borderColor: "#22c55e",
          backgroundColor: ehBarra ? "#22c55e" : "rgba(34,197,94,0.05)",
          tension: 0.2,
          fill: false,
        },
        {
          label: "Evadidos",
          data: evadidosAlinhados,
          borderColor: "#ef4444",
          backgroundColor: ehBarra ? "#ef4444" : "rgba(239,68,68,0.05)",
          tension: 0.2,
          fill: false,
        },
        {
          label: "Trancados",
          data: trancadosAlinhados,
          borderColor: "#3b82f6",
          backgroundColor: ehBarra ? "#3b82f6" : "rgba(59,130,246,0.05)",
          tension: 0.2,
          fill: false,
        },
      ];

      new Chart(document.getElementById("chartTrend"), {
        type: tipoGrafico,
        data: {
          labels: anosUnicos,
          datasets: datasetsFormatados,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              align: "center",
              labels: {
                usePointStyle: true,
                pointStyle: "circle",
                boxWidth: 8,
                font: { family: "Public Sans", size: 12 },
                color: "#6b7280",
                padding: 24,
              },
            },
            tooltip: {
              backgroundColor: "#1a1a2e",
              titleFont: { family: "Public Sans", size: 12 },
              bodyFont: { family: "Public Sans", size: 12 },
              padding: 10,
              cornerRadius: 8,
              mode: "index",
              intersect: false,
            },
          },
          scales: {
            x: {
              grid: { display: false },
              border: { display: false },
              ticks: {
                font: { family: "Public Sans", size: 11 },
                color: "#9ca3af",
              },
            },
            y: {
              grid: { color: "#b3b3b3" },
              border: { display: false },
              ticks: {
                font: { family: "Public Sans", size: 11 },
                color: "#9ca3af",
                maxTicksLimit: 6,
              },
              beginAtZero: true,
            },
          },
        },
      });
    })
    .catch((error) => {
      console.error(
        "Erro ao buscar dados do gráfico tendência de evasão:",
        error,
      );
    });
}

window.onload = async function () {
  await carregarAnos();
};
