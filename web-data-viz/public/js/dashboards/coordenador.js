const dadosKPIs = {
    2020: { evasao: 32, risco: "Médio", tendencia: "Diminuir (3%)", totalAlunos: 210 },
    2021: { evasao: 36, risco: "Médio", tendencia: "Aumentar (2%)", totalAlunos: 205 },
    2022: { evasao: 38, risco: "Alto", tendencia: "Aumentar (6%)", totalAlunos: 198 },
    2023: { evasao: 30, risco: "Médio", tendencia: "Diminuir (3%)", totalAlunos: 210 },
    2024: { evasao: 33, risco: "Médio", tendencia: "Aumentar (2%)", totalAlunos: 205 },
    2025: { evasao: 31, risco: "Alto", tendencia: "Aumentar (6%)", totalAlunos: 198 }
};

async function carregarDashboard() {
    plotarAnos();
    initPage("Visão Geral da Evasão no Curso");
    carregarKPIs();
    carregarGraficos();
}

function plotarAnos() {
    const select = document.getElementById("filtro");

    const anos = Object.keys(dadosKPIs);

    anos.forEach(ano => {
        const option = document.createElement("option");
        option.value = ano;
        option.textContent = ano;
        select.appendChild(option);
    });

    select.value = Math.max(...anos);

    select.addEventListener("change", (e) => {
        carregarKPIs(e.target.value);
    });
}

async function carregarKPIs(ano) {
    const anoAtual = ano ?? document.getElementById("filtro").value;

    const dados = dadosKPIs[anoAtual];

    if (!dados) {
        console.warn("Sem dados para o ano:", anoAtual);
        return;
    }

    const kpis = document.querySelectorAll(".kpi");

    kpis[0].children[0].innerText = `Taxa de evasão em ${anoAtual}`;

    kpis[0].children[1].innerText = dados.evasao + "%";
    kpis[1].children[1].innerText = dados.risco;
    kpis[2].children[1].innerText = dados.tendencia;
    kpis[3].children[1].innerText = dados.totalAlunos;
}

let chart;

async function carregarGraficos() {
    const ctx = document.getElementById('graph-taxa-evasao').getContext('2d');

    const anos = Object.keys(dadosKPIs);
    const valores = anos.map(ano => dadosKPIs[ano].evasao);
    const minValor = Math.min(...valores);
    const maxValor = Math.max(...valores);
    const minY = minValor - 4;
    const maxY = maxValor + 4;

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: anos,
            datasets: [{
                label: 'Taxa de evasão',
                data: valores,
                borderWidth: 2,
                borderColor: '#5B8FFF'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: minY,
                    max: maxY
                }
            }
        }
    });
}