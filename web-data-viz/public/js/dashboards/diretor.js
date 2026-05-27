const idInstituicao = sessionStorage.getItem('ID_INSTITUICAO');
let chartRankingInstance = null;

function carregarDados() {
    getKPIs();
    carregarGraficoEvasao();
}

async function carregarAnos() {
    try {
        const selectAnoInicio =
            document.getElementById('ano-inicio');

        const selectAnoFim =
            document.getElementById('ano-fim');

        const resposta = await fetch(
            `/dashboards/diretor/anos-disponiveis?idInstituicao=${idInstituicao}`
        );

        const anos = await resposta.json();

        selectAnoInicio.innerHTML = '';
        selectAnoFim.innerHTML = '';

        anos.forEach(item => {
            selectAnoInicio.innerHTML += `
            <option value="${item.ano}">
                ${item.ano}
            </option>
        `;
            selectAnoFim.innerHTML += `
            <option value="${item.ano}">
                ${item.ano}
            </option>
        `;
        });

        if (anos.length > 0) {
            selectAnoInicio.value = anos[0].ano;
            selectAnoFim.value = anos[anos.length - 1].ano;
        }

        carregarDados();
    } catch (erro) {
        console.error('Erro ao carregar anos disponíveis:', erro);
    }
}

async function buscarDados() {
    const anoInicio = document.getElementById('ano-inicio').value;
    const anoFim = document.getElementById('ano-fim').value;

    if (anoInicio && anoFim && anoInicio > anoFim) {
        alert('O ano de início deve ser menor ou igual ao ano de fim.');
        return;
    }

    carregarDados();
}

async function getKPIs() {
    const totalMatriculas = document.getElementById('total-matriculas');
    const alunosEvadidos = document.getElementById('alunos-evadidos');
    const taxaEvasao = document.getElementById('taxa-evasao');
    const evasaoPresencialEAD = document.getElementById('evasao-presencial-ead');

    const anoInicio = document.getElementById('ano-inicio').value;
    const anoFim = document.getElementById('ano-fim').value;

    fetch(`/dashboards/diretor/kpis?anoInicio=${anoInicio}&anoFim=${anoFim}&idInstituicao=${idInstituicao}`)
        .then(response => response.json())
        .then(data => {

            const dados = data[0];

            totalMatriculas.textContent = dados.totalMatriculas;
            alunosEvadidos.textContent = dados.alunosEvadidos;
            taxaEvasao.textContent = `${Number(dados.taxaEvasao).toFixed(2)}%`;
            evasaoPresencialEAD.textContent = `${Number(dados.evadidosPresencial).toFixed(2)}%/${Number(dados.evadidosEAD).toFixed(2)}%`;
        })
        .catch(error => {
            console.error('Erro ao buscar KPIs:', error);
            totalMatriculas.textContent = 'N/A';
            alunosEvadidos.textContent = 'N/A';
            taxaEvasao.textContent = 'N/A';
            evasaoPresencialEAD.textContent = 'N/A';
        });
}

function carregarGraficoEvasao() {
    const anoInicio = document.getElementById('ano-inicio').value;
    const anoFim = document.getElementById('ano-fim').value;

    fetch(`/dashboards/diretor/graficos/top-3-maior-evasao?anoInicio=${anoInicio}&anoFim=${anoFim}&idInstituicao=${idInstituicao}`)
        .then(response => response.json())
        .then(data => {
            console.log('Dados do gráfico de evasão:', data);

            const listaDados = Array.isArray(data) ? data : [data];
            const anosUnicos = [...new Set(listaDados.map(item => item.anoEmissao))];
            const cursosUnicos = [...new Set(listaDados.map(item => item.nomeCurso))];

            const chartExistente = Chart.getChart("chartRanking");
            if (chartExistente) {
                chartExistente.destroy();
            }

            const datasetsFormatados = cursosUnicos.slice(0, 3).map((curso, index) => {
                const dadosAlinhadosPorAno = anosUnicos.map(ano => {
                    const correspondencia = listaDados.find(item => item.nomeCurso === curso && item.anoEmissao === ano);
                    return correspondencia ? correspondencia.qtdDesvinculados : 0;
                });

                return {
                    label: curso,
                    data: dadosAlinhadosPorAno,
                    backgroundColor: ['#ef4444', '#3b82f6', '#f97316'][index],
                    stack: 'stack0',
                    borderRadius: 8,
                };
            });

            new Chart(document.getElementById('chartRanking'), {
                type: 'bar',
                data: {
                    labels: anosUnicos,
                    datasets: datasetsFormatados
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            align: 'center',
                            labels: {
                                usePointStyle: true,
                                pointStyle: 'circle',
                                boxWidth: 8,
                                font: { family: 'Public Sans', size: 12 },
                                color: '#6b7280',
                                padding: 20
                            }
                        },
                        tooltip: {
                            backgroundColor: '#1a1a2e',
                            titleFont: { family: 'Public Sans', size: 12 },
                            bodyFont: { family: 'Public Sans', size: 12 },
                            padding: 10,
                            cornerRadius: 8,
                            mode: 'index',
                            intersect: false,
                        }
                    },
                    scales: {
                        x: {
                            stacked: true,
                            grid: { display: false },
                            border: { display: false },
                            ticks: {
                                font: { family: 'Public Sans', size: 12 },
                                color: '#6b7280'
                            }
                        },
                        y: {
                            stacked: true,
                            grid: { color: '#b3b3b3' },
                            border: { display: false },
                            ticks: {
                                font: { family: 'Public Sans', size: 11 },
                                color: '#9ca3af',
                                maxTicksLimit: 6,
                            },
                            beginAtZero: true,
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Erro ao buscar dados do gráfico de evasão:', error);
        });
}


// grafico 2
new Chart(document.getElementById('chartTrend'), {
    type: 'line',
    data: {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        datasets: [
            {
                label: 'Matrículas',
                data: [1200, 780, 840, 840, 920],
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34,197,94,0.08)',
                pointBackgroundColor: '#fff',
                pointBorderColor: '#22c55e',
                pointBorderWidth: 2,
                pointRadius: 5,
                tension: 0,
                fill: false,
            },
            {
                label: 'Trancamentos',
                data: [900, 610, 610, 560, 700],
                borderColor: '#3C56DF',
                backgroundColor: 'rgba(74,108,247,0.08)',
                pointBackgroundColor: '#fff',
                pointBorderColor: '#3C56DF',
                pointBorderWidth: 2,
                pointRadius: 5,
                tension: 0,
                fill: false,
            },
            {
                label: 'Evasão',
                data: [300, 160, 210, 300, 230],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(249,115,22,0.08)',
                pointBackgroundColor: '#fff',
                pointBorderColor: '#ef4444',
                pointBorderWidth: 2,
                pointRadius: 5,
                tension: 0,
                fill: false,
            }

        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                align: 'center',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 8,
                    font: { family: 'Public Sans', size: 12 },
                    color: '#6b7280',
                    padding: 24
                }
            },
            tooltip: {
                backgroundColor: '#1a1a2e',
                titleFont: { family: 'Public Sans', size: 12 },
                bodyFont: { family: 'Public Sans', size: 12 },
                padding: 10,
                cornerRadius: 8,
                mode: 'index',
                intersect: false,
            }
        },
        scales: {
            x: {
                grid: { display: false },
                border: { display: false },
                ticks: {
                    font: { family: 'Public Sans', size: 11 },
                    color: '#9ca3af'
                }
            },
            y: {
                grid: { color: '#b3b3b3' },
                border: { display: false },
                ticks: {
                    font: { family: 'Public Sans', size: 11 },
                    color: '#9ca3af',
                    maxTicksLimit: 6,
                },
                beginAtZero: true,
            }
        }
    }
});

window.onload = async function () {
    await carregarAnos();
    await getKPIs();
    await carregarGraficoEvasao();
};