const ctxLine = document.getElementById('lineChart');

new Chart(ctxLine, {
    type: 'line',
    data: {
        labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
        datasets: [
            {
                label: 'Matrículas',
                data: [70, 65, 62, 68, 72, 55],
                borderColor: 'green',
                backgroundColor: 'green',
                tension: 0,
                pointBorderWidth: 2,
                pointRadius: 5,
                fill: false,
            },
            {
                label: 'Desvinculados',
                data: [10, 25, 19, 20, 22, 21],
                borderColor: '#3498db',
                backgroundColor: '#3498db',
                tension: 0,
                pointBorderWidth: 2,
                pointRadius: 5,
                fill: false,
                
            },
            {
                label: 'Evasão',
                data: [30, 33, 40, 31, 50, 30],
                borderColor: 'red',
                backgroundColor: 'red',
                tension: 0,
                pointBorderWidth: 2,
                pointRadius: 5,
                fill: false,
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false

    }
});

const ctxDonut = document.getElementById('donutChart');

new Chart(ctxDonut, {
    type: 'doughnut',
    data: {
        labels: ['Ativos', 'Trancados', 'Desvinculados'],
        datasets: [{
            data: [50, 25, 25],
            backgroundColor: [
                '#6c63ff',
                '#ff7b7b',
                '#53c7de'
            ]
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});