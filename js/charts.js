// charts.js - Wrapper para Chart.js com configurações comuns
const charts = {
    defaultOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: { size: 12 }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { maxRotation: 45, minRotation: 0 }
            },
            y: {
                beginAtZero: false,
                grid: { color: 'rgba(0,0,0,0.05)' }
            }
        }
    },

    cores: [
        'rgb(59, 130, 246)',   // blue
        'rgb(16, 185, 129)',   // green
        'rgb(245, 158, 11)',   // amber
        'rgb(239, 68, 68)',    // red
        'rgb(139, 92, 246)',   // violet
        'rgb(236, 72, 153)'    // pink
    ],

    criar(ctx, tipo, labels, datasets) {
        return new Chart(ctx, {
            type: tipo,
            data: { labels, datasets },
            options: this.defaultOptions
        });
    },

    criarLinha(ctx, labels, datasets) {
        return this.criar(ctx, 'line', labels, datasets.map((ds, i) => ({
            ...ds,
            borderColor: this.cores[i % this.cores.length],
            backgroundColor: this.cores[i % this.cores.length].replace('rgb', 'rgba').replace(')', ', 0.1)'),
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6
        })));
    },

    criarBarra(ctx, labels, datasets) {
        return this.criar(ctx, 'bar', labels, datasets.map((ds, i) => ({
            ...ds,
            backgroundColor: this.cores[i % this.cores.length].replace('rgb', 'rgba').replace(')', ', 0.7)')
        })));
    }
};
