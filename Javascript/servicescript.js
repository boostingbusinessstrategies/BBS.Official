// Get references to elements
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');

// Add an event listener to the menu button
menuToggle.addEventListener('click', () => {
    // Toggle the 'active' class on the sidebar
    sidebar.classList.toggle('active');
});

// Add an event listener to the document to detect clicks outside the sidebar
document.addEventListener('click', (event) => {
    // If the sidebar is active and the click occurs outside the sidebar and the menu toggle
    if (sidebar.classList.contains('active') && !sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
        // Remove the 'active' class to close the sidebar
        sidebar.classList.remove('active');
    }
});

// Add animation to service cards
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mouseover', function () {
        card.classList.add('hover');
    });
    card.addEventListener('mouseout', function () {
        card.classList.remove('hover');
    });
});

// Smooth scrolling to sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth'
        });
    });
});
