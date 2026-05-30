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
            respostaGraficoLinha,
            respostaSituacao
        ] = await Promise.all([
            fetch(`/dashboards/coordenador/kpis?idCurso=${idCurso}&inicio=${inicio}&fim=${fim}`),

            fetch(`/dashboards/coordenador/graficos/taxa-evasao-anual?idCurso=${idCurso}&inicio=${inicio}&fim=${fim}`),

            fetch(`/dashboards/coordenador/graficos/situacao-alunos?idCurso=${idCurso}&inicio=${inicio}&fim=${fim}`)
        ]);

        const kpis = await respostaKpis.json();

        const graficoLinhaResposta = await respostaGraficoLinha.json();

        const situacaoResposta = await respostaSituacao.json();

        console.log(graficoLinhaResposta);

        console.log(situacaoResposta);

        const tituloGrafico = document
            .getElementById("titulo-grafico-linha");

        tituloGrafico.innerText =
            inicio === fim
                ? `Taxa de evasão (${inicio})`
                : `Taxa de evasão (${inicio} - ${fim})`;

        preencherKpis(kpis);

        renderizarGraficoLinha(graficoLinhaResposta.dados.serie);

        renderizarGraficoDonut(situacaoResposta.dados.serie);

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

    const taxas = dados.map(item => item.taxaEvasao);

    if (lineChart) {
        lineChart.destroy();
    }

    const ctx = document.getElementById("lineChart").getContext("2d");

    const tipoGrafico =
        dados.length === 1
            ? "bar"
            : "line";

    lineChart = new Chart(ctx, {

        type: tipoGrafico,

        data: {

            labels,

            datasets: [
                {
                    label: "Taxa de Evasão (%)",
                    data: taxas,
                    borderColor: "red",
                    backgroundColor: "red",
                    tension: 0,
                    pointRadius: 5
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function renderizarGraficoDonut(dados) {

    if (donutChart) {
        donutChart.destroy();
    }

    const ultimoAno = dados[dados.length - 1];

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
                        "#6c63ff",
                        "#ff7b7b",
                        "#53c7de"
                    ]
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}