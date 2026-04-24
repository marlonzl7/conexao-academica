const dadosKPIs = {
    
};

async function carregarDashboard() {
    plotarAnos();

    if (typeof initPage === "function") initPage("Visão Geral da Evasão no Curso");
    
    carregarKPIs();
    carregarGraficos();
}

function plotarAnos() {
    const select = document.getElementById("ano");
    if (!select) return;

    const anos = Object.keys(dadosKPIs);
    anos.sort((a, b) => b - a);

    select.innerHTML = "";

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
    const selectAno = document.getElementById("ano");
    const anoAtual = ano ?? selectAno.value;
    const dados = dadosKPIs[anoAtual];

    if (!dados) return;

    const elEvasao = document.getElementById("evasao-valor");
    const elRisco = document.getElementById("risco-valor");
    const elTendencia = document.getElementById("tendencia-valor");

    if (elEvasao) {
        elEvasao.innerText = dados.evasao + "%";
        elEvasao.parentElement.querySelector('h3').innerText = `Taxa de evasão em ${anoAtual}`;
    }

    if (elRisco) {
        elRisco.innerText = dados.risco;
        const footerRisco = elRisco.parentElement.querySelector('.kpi-footer b');
        if (footerRisco) footerRisco.innerText = dados.alerta || "0";
    }

    if (elTendencia) {
        elTendencia.innerText = dados.tendencia;
    }
}

let chartEvasao;
let chartMotivos;

async function carregarGraficos() {
    const canvasEvasao = document.getElementById('graph-taxa-evasao');

    if (canvasEvasao) {
        const ctxEvasao = canvasEvasao.getContext('2d');
        const anos = Object.keys(dadosKPIs);
        const valores = anos.map(ano => dadosKPIs[ano].evasao);

        if (chartEvasao) chartEvasao.destroy();
        chartEvasao = new Chart(ctxEvasao, {
            type: 'line',
            data: {
                labels: anos,
                datasets: [{
                    label: 'Taxa de evasão %',
                    data: valores,
                    borderWidth: 3,
                    borderColor: '#5B8FFF',
                    backgroundColor: 'rgba(91, 143, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }
}