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
            if (selectedValue === 'expand_database') {
                extensionOptions.style.display = 'block';
                modificationOptions.style.display = 'none';
            } else if (selectedValue === 'modify_database') {
                extensionOptions.style.display = 'none';
                modificationOptions.style.display = 'block';
            } else {
                extensionOptions.style.display = 'none';
                modificationOptions.style.display = 'none';
            }
        });
    }

    // Parte 2: Manejo del sidebar
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
            if (selectedValue === 'expand_database') {
                extensionOptions.style.display = 'block';
                modificationOptions.style.display = 'none';
            } else if (selectedValue === 'modify_database') {
                extensionOptions.style.display = 'none';
                modificationOptions.style.display = 'block';
            } else {
                extensionOptions.style.display = 'none';
                modificationOptions.style.display = 'none';
            }
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

    // Al hacer clic en el botón de toggle, se activa/desactiva el sidebar
    menuToggle.addEventListener('click', function(event) {
        event.stopPropagation(); // Evita que el clic propague y cierre el sidebar inmediatamente
        toggleSidebar();
    });

    // Cierra el sidebar si se hace clic fuera de él
    document.addEventListener('click', function(event) {
        if (sidebar.classList.contains('active') && !sidebar.contains(event.target) && event.target !== menuToggle) {
            toggleSidebar();
        }
    });

    // Asegura que al hacer clic dentro del sidebar no se cierre accidentalmente
    sidebar.addEventListener('click', function(event) {
        event.stopPropagation(); // Evita que los clics dentro del sidebar lo cierren
    });

    console.log('Sidebar script loaded successfully');
});
