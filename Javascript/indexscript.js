// Asegúrate de incluir la librería de Chart.js en tu archivo HTML
// <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>

document.addEventListener('DOMContentLoaded', function() {
    // Configuración del gráfico
    function getChartConfig(isDark) {
        return {
            color: isDark ? '#ffffff' : '#111827',
            borderColor: '#ffc44d',
            gridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            backgroundColor: 'rgba(255, 196, 77, 0.1)'
        };
    }

    function createChart(canvasId, data, type = 'line') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const colors = getChartConfig(isDark);
        const ctx = document.getElementById(canvasId).getContext('2d');

        return new Chart(ctx, {
            type: type,
            data: {
                labels: data.labels,
                datasets: [{
                    label: data.label,
                    data: data.values,
                    borderColor: colors.borderColor,
                    backgroundColor: colors.backgroundColor,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { color: colors.gridColor },
                        ticks: { color: colors.color }
                    },
                    y: {
                        grid: { color: colors.gridColor },
                        ticks: {
                            color: colors.color,
                            callback: value => data.format ? data.format(value) : value
                        }
                    }
                }
            }
        });
    }

    // Datos para cada gráfico
    const revenueData = {
        label: 'Monthly Revenue',
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        values: [120000, 150000, 130000, 170000, 200000, 180000, 220000],
        format: value => '$' + value.toLocaleString()
    };

    const stockData = {
        label: 'Stock Level',
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        values: [500, 450, 600, 550, 700, 650, 800],
        format: value => value.toLocaleString() + ' units'
    };

    const satisfactionData = {
        label: 'Patient Satisfaction',
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        values: [85, 87, 86, 89, 90, 92, 91],
        format: value => value + '%'
    };

    const efficiencyData = {
        label: 'Operational Efficiency',
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        values: [75, 78, 80, 82, 83, 85, 84],
        format: value => value + '%'
    };

    // Crear gráficos
    createChart('revenueChart', revenueData);
    createChart('stockChart', stockData);
    createChart('satisfactionChart', satisfactionData);
    createChart('efficiencyChart', efficiencyData);

    // Automatización del carrusel para paneles
    const panels = document.querySelectorAll('.panel');
    let currentIndex = 0;

    function showNextPanel() {
        panels[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % panels.length;
        panels[currentIndex].classList.add('active');
    }

    setInterval(showNextPanel, 5000);

    function handleResize() {
        const dashboardContainer = document.querySelector('.dashboard-ecosystem');

        if (window.innerWidth <= 768) {
            dashboardContainer.style.visibility = 'hidden';
            dashboardContainer.style.height = '0';
        } else {
            dashboardContainer.style.visibility = 'visible';
            dashboardContainer.style.height = 'auto';
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    // Lógica para el sidebar
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.desktop-nav ul');

    if (!sidebar || !menuToggle) {
        console.error('Sidebar or menu toggle not found');
        return;
    }

    function toggleSidebar() {
        sidebar.classList.toggle('active');
        menuToggle.classList.toggle('active');
    }

    menuToggle.addEventListener('click', function(event) {
        event.stopPropagation();
        toggleSidebar();
    });

    document.addEventListener('click', function(event) {
        if (sidebar.classList.contains('active') && !sidebar.contains(event.target) && event.target !== menuToggle) {
            toggleSidebar();
        }
    });

    sidebar.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    mobileMenuBtn.addEventListener('click', function() {
        navList.classList.toggle('show');
    });
});
