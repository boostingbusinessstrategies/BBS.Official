// Obtén referencias a los elementos
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');

// Añade un event listener al botón del menú
menuToggle.addEventListener('click', () => {
    // Alterna la clase 'active' en el sidebar
    sidebar.classList.toggle('active');
});

// Añade un event listener al documento para detectar clics fuera del sidebar
document.addEventListener('click', (event) => {
    // Si el sidebar está activo y el clic ocurre fuera del sidebar y del menú toggle
    if (sidebar.classList.contains('active') && !sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
        // Elimina la clase 'active' para cerrar el sidebar
        sidebar.classList.remove('active');
    }
});

// Añadir un event listener a los enlaces del sidebar para cerrarlo al hacer clic
const sidebarLinks = sidebar.querySelectorAll('ul li a');
sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('active'); // Cierra el sidebar al hacer clic en un enlace
    });
});
