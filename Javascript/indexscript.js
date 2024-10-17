document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const desktopNav = document.querySelector('.desktop-nav');
    
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
    
    // Funcionalidad para la navegación de escritorio
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.desktop-nav ul');

    mobileMenuBtn.addEventListener('click', function() {
        navList.classList.toggle('show');
    });
});
