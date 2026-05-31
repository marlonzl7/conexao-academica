Chart.register(ChartDataLabels);

let lineChart;
let donutChart;

window.addEventListener("DOMContentLoaded", async () => {

    await carregarFiltros();

    await carregarDashboard();

    document
        .getElementById("filtro-inicio")
        .addEventListener("change", carregarDashboard);

    document
        .getElementById("filtro-fim")
        .addEventListener("change", carregarDashboard);
});

async function carregarDashboard() {

    try {

        const idCurso = sessionStorage.getItem("ID_CURSO");
        
        const inicio = document
            .getElementById("filtro-inicio")
            .value;

        const fim = document
            .getElementById("filtro-fim")
            .value;

        const [
            respostaKpis,
            respostaGraficoLinha
        ] = await Promise.all([
            fetch(`/dashboards/coordenador/kpis?idCurso=${idCurso}&inicio=${inicio}&fim=${fim}`),

            fetch(`/dashboards/coordenador/graficos/taxa-evasao-anual?idCurso=${idCurso}&inicio=${inicio}&fim=${fim}`)
        ]);

        const kpis = await respostaKpis.json();

        document.getElementById("nome-curso").innerText = `Curso: ${kpis.dados.curso.nome}`;

        const graficoLinhaResposta = await respostaGraficoLinha.json();

        console.log(graficoLinhaResposta);

        preencherKpis(kpis);

        const serie = graficoLinhaResposta.dados.serie;

        renderizarGraficoLinha(serie);
        renderizarGraficoDonut(serie);

    } catch (erro) {

        console.error("Erro ao carregar dashboard:", erro);

    }
}

async function carregarFiltros() {

    try {

        const idCurso = sessionStorage.getItem("ID_CURSO");

        const resposta = await fetch(
            `/dashboards/coordenador/anos?idCurso=${idCurso}`
        );

        const json = await resposta.json();

        const anos = json.dados.anos;

        const filtroInicio = document.getElementById("filtro-inicio");

        const filtroFim = document.getElementById("filtro-fim");

        filtroInicio.innerHTML = "";

        filtroFim.innerHTML = "";

        anos.forEach((item, index) => {

        const optionInicio = document.createElement("option");

        optionInicio.value = item.ano;
        optionInicio.textContent = item.ano;

        if (index === 0) {
            optionInicio.selected = true;
        }

        filtroInicio.appendChild(optionInicio);

        const optionFim = document.createElement("option");

        optionFim.value = item.ano;
        optionFim.textContent = item.ano;

        if (index === anos.length - 1) {
            optionFim.selected = true;
        }

        filtroFim.appendChild(optionFim);
    });

    } catch (erro) {

        console.error("Erro ao carregar filtros:", erro);

    }
}

function preencherKpis(resposta) {

    const { kpis } = resposta.dados;

    document.getElementById("kpi-total-matriculas")
        .innerText = kpis.matriculas.valor;

    const classificacaoMatriculas = document
        .getElementById("classificacao-total-matriculas");

    if (kpis.matriculas.classificacao) {

        classificacaoMatriculas.innerText =
            `${kpis.matriculas.classificacao.nome} - ${kpis.matriculas.classificacao.descricao}`;

        classificacaoMatriculas.style.color =
            kpis.matriculas.classificacao.cor;

    } else {

        classificacaoMatriculas.innerText =
            "Sem classificação";

        classificacaoMatriculas.style.color = "";

    }

    document.getElementById("kpi-alunos-evadidos")
        .innerText = kpis.evadidos.valor;

    const classificacaoEvadidos = document
        .getElementById("classificacao-alunos-evadidos");

    if (kpis.evadidos.classificacao) {

        classificacaoEvadidos.innerText =
            `${kpis.evadidos.classificacao.nome} - ${kpis.evadidos.classificacao.descricao}`;

        classificacaoEvadidos.style.color =
            kpis.evadidos.classificacao.cor;

    } else {

        classificacaoEvadidos.innerText =
            "Sem classificação";

        classificacaoEvadidos.style.color = "";

    }

    document.getElementById("kpi-taxa-evasao")
        .innerText = `${kpis.taxaEvasao.valor}%`;

    const classificacaoTaxa = document
        .getElementById("classificacao-taxa-evasao");

    if (kpis.taxaEvasao.classificacao) {

        classificacaoTaxa.innerText =
            `${kpis.taxaEvasao.classificacao.nome} - ${kpis.taxaEvasao.classificacao.descricao}`;

        classificacaoTaxa.style.color =
            kpis.taxaEvasao.classificacao.cor;

    } else {

        classificacaoTaxa.innerText =
            "Sem classificação";

        classificacaoTaxa.style.color = "";

    }

    document.getElementById("kpi-risco-evasao")
        .innerText = `${kpis.riscoEvasao.valor}%`;

    const descricaoRisco = document
        .getElementById("descricao-risco-evasao");

    if (kpis.riscoEvasao.classificacao) {

        descricaoRisco.innerText =
            `${kpis.riscoEvasao.classificacao.nome} - ${kpis.riscoEvasao.classificacao.descricao}`;

        descricaoRisco.style.color =
            kpis.riscoEvasao.classificacao.cor;

    } else {

        descricaoRisco.innerText =
            "Sem classificação";

        descricaoRisco.style.color = "";

    }
}

function renderizarGraficoLinha(dados) {

    const labels = dados.map(item => item.ano);

    if (lineChart) {
        lineChart.destroy();
    }

    const ctx =
        document.getElementById("lineChart")
            .getContext("2d");

    const tipoGrafico =
        dados.length === 1
            ? "bar"
            : "line";

    const ehBarra = dados.length === 1;

    lineChart = new Chart(ctx, {

        type: tipoGrafico,

        data: {

            labels,

            datasets: [

                {
                    label: "Ativos",

                    data: dados.map(
                        item => item.ativos
                    ),

                    borderColor: "#22c55e",
                    backgroundColor: ehBarra ? "#22c55e" : "rgba(34,197,94,0.05)",

                    tension: 0.2,

                    fill: false,

                    pointRadius: 3,
                    pointHoverRadius: 5
                },

                {
                    label: "Evadidos",

                    data: dados.map(
                        item => item.evadidos
                    ),

                    borderColor: "#ef4444",
                    backgroundColor: ehBarra ? "#ef4444" : "rgba(239,68,68,0.05)",

                    tension: 0.2,

                    fill: false,

                    pointRadius: 3,
                    pointHoverRadius: 5
                },

                {
                    label: "Trancados",

                    data: dados.map(
                        item => item.trancados
                    ),

                    borderColor: "#3b82f6",
                    backgroundColor: ehBarra ? "#3b82f6" : "rgba(59,130,246,0.05)",

                    tension: 0.2,

                    fill: false,

                    pointRadius: 3,
                    pointHoverRadius: 5
                }
            ]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                datalabels: {
                    display: false
                },

                legend: {

                    position: "bottom",

                    align: "center",

                    labels: {

                        usePointStyle: true,

                        pointStyle: "circle",

                        boxWidth: 8,

                        font: {
                            family: "Public Sans",
                            size: 12
                        },

                        color: "#6b7280",

                        padding: 10
                    }
                },

                tooltip: {

                    backgroundColor: "#1a1a2e",

                    titleFont: {
                        family: "Public Sans",
                        size: 12
                    },

                    bodyFont: {
                        family: "Public Sans",
                        size: 12
                    },

                    padding: 10,

                    cornerRadius: 8,

                    mode: "index",

                    intersect: false
                }
            },

            layout: {
                padding: {
                    bottom: 20
                }
            },

            scales: {

                x: {

                    grid: {
                        display: false
                    },

                    border: {
                        display: false
                    },

                    ticks: {

                        font: {
                            family: "Public Sans",
                            size: 11
                        },

                        color: "#9ca3af"
                    }
                },

                y: {

                    grid: {
                        color: "#b3b3b3"
                    },

                    border: {
                        display: false
                    },

                    ticks: {

                        font: {
                            family: "Public Sans",
                            size: 11
                        },

                        color: "#9ca3af",

                        maxTicksLimit: 6
                    },
                }
            }
        }
    });
}

function renderizarGraficoDonut(dados) {

    if (donutChart) {
        donutChart.destroy();
    }

    const ultimoAno = dados[dados.length - 1];

    document.getElementById("titulo-donut").innerText =
        `Distribuição da Situação dos Alunos (${ultimoAno.ano})`;

    const ctx = document.getElementById("donutChart");

    donutChart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [
                "Ativos",
                "Trancados",
                "Evadidos"
            ],

            datasets: [
                {
                    data: [
                        ultimoAno.ativos,
                        ultimoAno.trancados,
                        ultimoAno.evadidos
                    ],

                    backgroundColor: [
                        "#22c55e",
                        "#3b82f6",
                        "#ef4444"
                    ]
                }
            ]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                datalabels: {

                    color: "#fff",

                    font: {
                        weight: "bold",
                        size: 13
                    },

                    formatter: (value, context) => {

                        const total =
                            context.dataset.data.reduce(
                                (acc, curr) => acc + curr,
                                0
                            );

                        return `${((value / total) * 100).toFixed(0)}%`;
                    }
                },

                legend: {

                    position: "bottom",

                    labels: {

                        usePointStyle: true,

                        pointStyle: "circle",

                        boxWidth: 8,

                        font: {
                            family: "Public Sans",
                            size: 12
                        },

                        color: "#6b7280",

                        padding: 20
                    }
                }
            },

            layout: {
                padding: {
                    bottom: 20
                }
            }

        }
    });
}