document.addEventListener('DOMContentLoaded', function() {
    // Sidebar functionality
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

    // Reveal functionality
    function reveal() {
        var reveals = document.querySelectorAll(".reveal");
        for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("active");
            } else {
                reveals[i].classList.remove("active");
            }
        }
    }

    window.addEventListener("scroll", reveal);
    reveal(); // Call once to check for elements in view on page load

    // Comprobar si hay elementos 'reveal' y si tienen la clase 'active'
    const reveals = document.querySelectorAll('.reveal.active');
    if (reveals.length > 0) {
        console.log(`Se encontraron ${reveals.length} elementos "reveal" visibles.`);
    } else {
        console.log('No hay elementos "reveal" visibles al cargar la página.');
    }

    // Low-performance detection
    if (navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2) {
        document.documentElement.classList.add('low-performance');
    }

    // FAQ functionality
    const questions = document.querySelectorAll('.faq-section h3.question');

    questions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling; // La respuesta está justo después de la pregunta
            answer.classList.toggle('active'); // Alterna la clase 'active'
            // Cambiar el signo
            const sign = this.querySelector('.sign'); // Asegúrate de que hay un elemento con clase 'sign'
            if (answer.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px"; // Expandir
                sign.textContent = '-'; // Cambia a signo menos
            } else {
                answer.style.maxHeight = null; // Colapsar
                sign.textContent = '+'; // Cambia a signo más
            }
        });
    });
});
