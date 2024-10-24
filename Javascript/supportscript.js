document.addEventListener('DOMContentLoaded', function () {
    // Parte 1: Manejo de las opciones de contacto
    const contactReason = document.getElementById('contact-reason');
    const extensionOptions = document.getElementById('extension-options');
    const modificationOptions = document.getElementById('modification-options');

    // Oculta ambas secciones al cargar la página
    if (extensionOptions) extensionOptions.style.display = 'none';
    if (modificationOptions) modificationOptions.style.display = 'none';

    if (contactReason) {
        contactReason.addEventListener('change', function () {
            const selectedValue = contactReason.value;
            console.log('Selected Value:', selectedValue); // Para depuración

            // Mostrar u ocultar las secciones según la selección
            if (extensionOptions) extensionOptions.style.display = selectedValue === 'expand_database' ? 'block' : 'none';
            if (modificationOptions) modificationOptions.style.display = selectedValue === 'modify_database' ? 'block' : 'none';
        });
    }

    // Parte 2: Manejo del sidebar
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');

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

    console.log('Sidebar script loaded');
});
