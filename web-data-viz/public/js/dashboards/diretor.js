new Chart(document.getElementById('chartRanking'), {
    type: 'bar',
    data: {
        labels: ['2013', '2015', '2016', '2017', '2018'],
        datasets: [
            {
                label: 'ADS',
                data: [100, 100, 110, 115, 105],
                backgroundColor: '#ef4444',
                stack: 'stack0',
                borderRadius: 8,
            },
            {
                label: 'CCO',
                data: [80, 75, 60, 55, 80],
                backgroundColor: '#3b82f6',
                stack: 'stack0',
                borderRadius: 8,
            },
            {
                label: 'SIS',
                data: [95, 35, 35, 30, 60],
                backgroundColor: '#f97316',
                stack: 'stack0',
                borderRadius: 8,
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