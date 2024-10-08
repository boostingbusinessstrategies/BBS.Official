// Número de reseñas visibles inicialmente
const reviewsToShow = 8;

// Variable para determinar si eres un super usuario
const isAdmin = true; // Cambia a false si no deseas acceso total

// Función para cargar más reseñas
function showMoreReviews() {
    const feedbackListElement = document.getElementById("feedback-list");
    const feedbackItems = feedbackListElement.querySelectorAll("li");

    // Mostrar las reseñas adicionales
    for (let i = reviewsToShow; i < feedbackItems.length; i++) {
        feedbackItems[i].style.display = "list-item";
    }

    // Ocultar el botón de "Show More Reviews" después de mostrar más reseñas
    document.getElementById("show-more-reviews").style.display = "none";
}

// Función para mostrar feedback, limitada a las primeras reseñas visibles
function displayFeedback() {
    const feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
    const feedbackListElement = document.getElementById("feedback-list");

    // Limpiar la lista de reseñas
    feedbackListElement.innerHTML = "";

    // Crear el elemento de reseña y añadirlo a la lista
    feedbackList.forEach((feedback, index) => {
        const feedbackItem = document.createElement("li");
        feedbackItem.style.display = index < reviewsToShow ? "list-item" : "none"; // Mostrar solo las primeras reseñas
        feedbackItem.innerHTML = `
            <div>${feedback.firstName} ${feedback.lastName}</div>
            <div class="rating">${'⭐'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)}</div>
            <div>${feedback.comment}</div>
            ${isAdmin ? `<button onclick="deleteFeedback(${index})">Delete</button>` : ''} <!-- Botón de eliminar solo si es admin -->
        `;
        feedbackListElement.appendChild(feedbackItem);
    });

    // Mostrar el botón de "Show More Reviews" solo si hay más reseñas que el límite
    if (feedbackList.length > reviewsToShow) {
        document.getElementById("show-more-reviews").style.display = "block";
    } else {
        document.getElementById("show-more-reviews").style.display = "none";
    }
}

// Función para enviar feedback
function submitFeedback(event) {
    // Llamamos a preventDefault solo para evitar que se envíe el formulario antes de que validemos
    event.preventDefault();

    // Obtener valores del formulario
    const firstName = document.getElementById("feedback-first-name").value.trim();
    const lastName = document.getElementById("feedback-last-name").value.trim();
    const email = document.getElementById("feedback-email").value.trim(); // Obtener el email
    const rating = document.getElementById("feedback-rating").value;
    const comment = document.getElementById("feedback-comment").value.trim();

    // Validar campos
    if (!firstName || !lastName || !email || !rating || !comment) {
        alert("Please fill in all fields before submitting your feedback.");
        return;
    }

    // Validar formato del email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Crear el objeto feedback
    const feedback = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        rating: parseInt(rating, 10),
        comment: comment
    };

    try {
        // Guardar feedback en localStorage
        let feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
        feedbackList.push(feedback);
        localStorage.setItem("feedbackList", JSON.stringify(feedbackList));

        // Limpiar el formulario
        clearFeedbackForm();

        // Actualizar la lista de feedback para mostrar la nueva reseña
        displayFeedback();

        // Enviar el formulario usando el método POST
        document.getElementById("feedback-form").submit();

    } catch (error) {
        console.error("Error saving feedback to local storage:", error);
        alert("There was an error saving your feedback. Please try again.");
    }
}

// Función para eliminar feedback
function deleteFeedback(index) {
    if (!isAdmin) {
        alert("No tienes permiso para eliminar esta reseña.");
        return;
    }
    
    try {
        let feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
        feedbackList.splice(index, 1); // Eliminar la reseña
        localStorage.setItem("feedbackList", JSON.stringify(feedbackList)); // Actualizar localStorage
        displayFeedback(); // Actualizar la lista de feedback
    } catch (error) {
        console.error("Error deleting feedback:", error);
        alert("Hubo un error al eliminar la reseña. Por favor, intenta nuevamente.");
    }
}

// Cargar feedback al cargar la página
window.onload = () => {
    displayFeedback();
};

// Sidebar functionality
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');

// Añadir un event listener al botón del menú
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Detectar clics fuera del sidebar para cerrarlo
document.addEventListener('click', (event) => {
    if (sidebar.classList.contains('active') && !sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
        sidebar.classList.remove('active');
    }
});

// Cerrar el sidebar al hacer clic en los enlaces
const sidebarLinks = sidebar.querySelectorAll('ul li a');
sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });
});

