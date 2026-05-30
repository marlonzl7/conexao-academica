const idInstituicao = sessionStorage.getItem('ID_INSTITUICAO');

async function carregarDados() {
    await getKPIs();
    await carregarGraficoRanking();
    await carregarGraficoEvasao();
}

async function carregarAnos() {
    try {
        const selectAnoInicio = document.getElementById('ano-inicio');
        const selectAnoFim = document.getElementById('ano-fim');

        const resposta = await fetch(`/dashboards/diretor/anos-disponiveis?idInstituicao=${idInstituicao}`);
        const anos = await resposta.json();

        selectAnoInicio.innerHTML = '';
        selectAnoFim.innerHTML = '';

        anos.forEach(item => {
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

    await carregarDados();
}

async function getKPIs() {
    const totalMatriculas = document.getElementById('total-matriculas');
    const alunosEvadidos = document.getElementById('alunos-evadidos');
    const taxaEvasao = document.getElementById('taxa-evasao');
    const evasaoPresencialEAD = document.getElementById('evasao-presencial-ead');

    const anoInicio = document.getElementById('ano-inicio').value;
    const anoFim = document.getElementById('ano-fim').value;

    try {
        const response = await fetch(`/dashboards/diretor/kpis?anoInicio=${anoInicio}&anoFim=${anoFim}&idInstituicao=${idInstituicao}`);
        const data = await response.json();

        if (data && data.length > 0) {
            const dados = data[0];
            totalMatriculas.textContent = dados.totalMatriculas ?? 0;
            alunosEvadidos.textContent = dados.alunosEvadidos ?? 0;
            taxaEvasao.textContent = `${Number(dados.taxaEvasao || 0).toFixed(2)}%`;
            evasaoPresencialEAD.textContent = `${Number(dados.evadidosPresencial || 0).toFixed(2)}% / ${Number(dados.evadidosEAD || 0).toFixed(2)}%`;
        }
    } catch (error) {
        console.error('Erro ao buscar KPIs:', error);
        totalMatriculas.textContent = 'N/A';
        alunosEvadidos.textContent = 'N/A';
        taxaEvasao.textContent = 'N/A';
        evasaoPresencialEAD.textContent = 'N/A';
    }
}

function carregarGraficoRanking() {
    const anoInicio = document.getElementById('ano-inicio').value;
    const anoFim = document.getElementById('ano-fim').value;

    fetch(`/dashboards/diretor/graficos/top-3-maior-evasao?anoInicio=${anoInicio}&anoFim=${anoFim}&idInstituicao=${idInstituicao}`)
        .then(response => response.json())
        .then(data => {
            console.log('Dados do gráfico de ranking:', data);

            const listaDados = Array.isArray(data) ? data : [data];
            const anosUnicos = [...new Set(listaDados.map(item => item.anoEmissao))].sort();
            const cursosUnicos = [...new Set(listaDados.map(item => item.nomeCurso))];

            const chartExistente = Chart.getChart("chartRanking");
            if (chartExistente) {
                chartExistente.destroy();
            }

            const cores = ['#818cf8', '#f87171', '#34d399']; 

            const datasetsFormatados = cursosUnicos.slice(0, 3).map((curso, index) => {
                const dadosAlinhadosPorAno = anosUnicos.map(ano => {
                    const correspondencia = listaDados.find(item => item.nomeCurso === curso && item.anoEmissao === ano);
                    return correspondencia ? correspondencia.qtdDesvinculados : 0;
                });

                return {
                    label: curso,
                    data: dadosAlinhadosPorAno,
                    backgroundColor: cores[index],
                    stack: 'stack0',
                    borderRadius: 4,
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
            console.error('Erro ao buscar dados do gráfico de ranking:', error);
        });
}

function carregarGraficoEvasao() {
    const anoInicio = document.getElementById('ano-inicio').value;
    const anoFim = document.getElementById('ano-fim').value;

    fetch(`/dashboards/diretor/graficos/taxa-evasao-anual?anoInicio=${anoInicio}&anoFim=${anoFim}&idInstituicao=${idInstituicao}`)
        .then(response => response.json())
        .then(data => {
            console.log('Dados do gráfico tendência de evasão:', data);

            const listaDados = Array.isArray(data) ? data : [data];
            const anosUnicos = [...new Set(listaDados.map(item => item.anoEmissao))].sort();

            const chartExistente = Chart.getChart("chartTrend");
            if (chartExistente) {
                chartExistente.destroy();
            }

            const matriculasAlinhadas = anosUnicos.map(ano => {
                const registro = listaDados.find(item => item.anoEmissao === ano);
                return registro ? Number(registro.totalMatriculas) : 0;
            });

            const evadidosAlinhados = anosUnicos.map(ano => {
                const registro = listaDados.find(item => item.anoEmissao === ano);
                return registro ? Number(registro.qtdDesvinculados) : 0;
            });

            const trancadosAlinhados = anosUnicos.map(ano => {
                const registro = listaDados.find(item => item.anoEmissao === ano);
                return registro ? Number(registro.qtdTrancados) : 0;
            });

            const datasetsFormatados = [
                {
                    label: 'Matrículas',
                    data: matriculasAlinhadas,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34,197,94,0.05)',
                    tension: 0.2,
                    fill: false,
                },
                {
                    label: 'Evadidos',
                    data: evadidosAlinhados,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239,68,68,0.05)',
                    tension: 0.2,
                    fill: false,
                },
                {
                    label: 'Trancados',
                    data: trancadosAlinhados,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59,130,246,0.05)',
                    tension: 0.2,
                    fill: false,
                }
            ];

            new Chart(document.getElementById('chartTrend'), {
                type: 'line',
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
        })
        .catch(error => {
            console.error('Erro ao buscar dados do gráfico tendência de evasão:', error);
        });
}

window.onload = async function () {
    await carregarAnos();
};