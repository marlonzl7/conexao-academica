new Chart(document.getElementById('chartRanking'), {
    type: 'bar',
    data: {
        labels: ['SIS', 'CCO', 'ADS'],
        datasets: [{
            label: 'Taxa de evasão (%)',
            data: [40, 38, 22],
            backgroundColor: '#4e73df'
        }]
    },
    options: {
        indexAxis: 'y', // Barra deitada
        responsive: true,
        maintainAspectRatio: false,
            plugins: {
            title: {
                display: true,
                text: 'Ranking de Evasão por Curso',
                font: {
                    size: 20
                },
                align: 'start',
                color: '#00000'
            }
        }
    }
});

new Chart(document.getElementById('chartTrend'), {
    type: 'line',
    data: {
        labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
        datasets: [{
            label: 'Evolução (%)',
            data: [47, 45, 49, 55, 51, 47, 39, 32],
            borderColor: '#4e73df',
            fill: false,
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Evolução Anual',
                font: {
                    size: 20
                },
                align: 'start',
                color: '#000000'
            }
        }
    }
});