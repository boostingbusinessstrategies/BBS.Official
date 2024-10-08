// Número de reseñas visibles inicialmente
const reviewsToShow = 8;

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

    // Limitar las reseñas visibles inicialmente
    const limit = Math.min(feedbackList.length, reviewsToShow);

    // Crear el elemento de reseña y añadirlo a la lista
    feedbackList.forEach((feedback, index) => {
        const feedbackItem = document.createElement("li");
        feedbackItem.style.display = index < reviewsToShow ? "list-item" : "none"; // Mostrar solo las primeras reseñas
        feedbackItem.innerHTML = `
            <div>${feedback.firstName} ${feedback.lastName}</div>
            <div class="rating">${'⭐'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)}</div>
            <div>${feedback.comment}</div>
            ${feedback.email === 'contact.aaronobando@gmail.com' ? `<button onclick="deleteFeedback(${index})">Delete</button>` : ''}
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

        // Mostrar mensaje de éxito
        showSuccessMessage();

        // Eliminar el formulario si deseas
        clearFeedbackForm();

    } catch (error) {
        console.error("Error saving feedback to local storage:", error);
        alert("There was an error saving your feedback. Please try again.");
    }
}

// Función para eliminar feedback
function deleteFeedback(index) {
    try {
        let feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
        const feedback = feedbackList[index];

        // Verificar si el email coincide con el superuser
        if (feedback.email === 'contact.aaronobando@gmail.com') {
            feedbackList.splice(index, 1); // Eliminar la reseña
            localStorage.setItem("feedbackList", JSON.stringify(feedbackList)); // Actualizar localStorage
            displayFeedback(); // Actualizar la lista de feedback
        } else {
            alert("You are not authorized to delete this feedback.");
        }
    } catch (error) {
        console.error("Error deleting feedback:", error);
        alert("There was an error deleting the feedback. Please try again.");
    }
}

// Función para mostrar mensaje de éxito
function showSuccessMessage() {
    const successMessage = document.createElement("div");
    successMessage.classList.add("feedback-success", "active");

    const checkIcon = document.createElement("i");
    checkIcon.classList.add("fas", "fa-check-circle", "feedback-check");

    const messageText = document.createElement("p");
    messageText.textContent = "Thank you for your feedback!";

    successMessage.appendChild(checkIcon);
    successMessage.appendChild(messageText);

    document.body.appendChild(successMessage);

    // Eliminar el mensaje después de 3 segundos
    setTimeout(() => {
        successMessage.classList.remove("active");
        document.body.removeChild(successMessage);
    }, 3000);
}

// Función para limpiar el formulario de feedback (opcional)
function clearFeedbackForm() {
    document.getElementById("feedback-first-name").value = '';
    document.getElementById("feedback-last-name").value = '';
    document.getElementById("feedback-email").value = '';
    document.getElementById("feedback-rating").value = '';
    document.getElementById("feedback-comment").value = '';
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
