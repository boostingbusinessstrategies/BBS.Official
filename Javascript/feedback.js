// Número de comentarios a mostrar inicialmente
const reviewsToShow = 8;

// Variables para controlar el estado del administrador y la capacidad de eliminar
let isAdmin = false; // Cambia a true si el usuario es administrador
let canDelete = false; // Cambia a true si se habilita la función de eliminar

// Función para cargar más comentarios
function showMoreReviews() {
    const feedbackListElement = document.getElementById("feedback-list");
    const feedbackItems = feedbackListElement.querySelectorAll("li");

    // Mostrar comentarios adicionales
    for (let i = reviewsToShow; i < feedbackItems.length; i++) {
        feedbackItems[i].style.display = "list-item";
    }

    // Ocultar el botón de "Mostrar más comentarios"
    document.getElementById("show-more-reviews").style.display = "none";
}

// Función para mostrar los comentarios limitados inicialmente
function displayFeedback() {
    const feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
    const feedbackListElement = document.getElementById("feedback-list");

    // Limpiar la lista de comentarios
    feedbackListElement.innerHTML = "";

    // Crear elementos de comentario y añadirlos a la lista
    feedbackList.forEach((feedback) => {
        const feedbackItem = document.createElement("li");
        feedbackItem.style.display = feedbackListElement.childElementCount < reviewsToShow ? "list-item" : "none"; // Mostrar solo los primeros comentarios
        feedbackItem.innerHTML = `
            <div>${feedback.firstName} ${feedback.lastName}</div>
            <div class="rating">${'⭐'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)}</div>
            <div>${feedback.comment}</div>
            ${isAdmin && canDelete ? `<button onclick="deleteFeedback('${feedback.id}')">Eliminar</button>` : ''}
        `;
        feedbackListElement.appendChild(feedbackItem);
    });

    // Mostrar el botón "Mostrar más comentarios" solo si hay más comentarios que el límite
    document.getElementById("show-more-reviews").style.display = feedbackList.length > reviewsToShow ? "block" : "none";

    updateButtonVisibility(); // Actualizar visibilidad de botones
}

// Función para enviar un nuevo comentario
function submitFeedback(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const firstName = document.getElementById("feedback-first-name").value.trim();
    const lastName = document.getElementById("feedback-last-name").value.trim();
    const email = document.getElementById("feedback-email").value.trim();
    const rating = document.getElementById("feedback-rating").value;
    const comment = document.getElementById("feedback-comment").value.trim();

    // Validar campos
    if (!firstName || !lastName || !email || !rating || !comment) {
        alert("Por favor, completa todos los campos antes de enviar el comentario.");
        return;
    }

    // Validar formato de correo electrónico
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Por favor, introduce una dirección de correo válida.");
        return;
    }

    // Crear el objeto de comentario
    const feedback = {
        id: Date.now().toString(),
        firstName: firstName,
        lastName: lastName,
        email: email,
        rating: parseInt(rating, 10),
        comment: comment
    };

    try {
        // Guardar comentario en localStorage
        let feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
        feedbackList.push(feedback);
        localStorage.setItem("feedbackList", JSON.stringify(feedbackList));

        // Limpiar el formulario
        clearFeedbackForm();

        // Actualizar la lista de comentarios
        displayFeedback();

    } catch (error) {
        console.error("Error al guardar el comentario:", error);
        alert("Hubo un error al guardar tu comentario. Por favor, intenta de nuevo.");
    }
}

// Función para eliminar un comentario
function deleteFeedback(id) {
    if (!isAdmin) {
        alert("No tienes permiso para eliminar este comentario.");
        return;
    }

    if (!canDelete) {
        alert("La función de eliminación está deshabilitada.");
        return;
    }

    try {
        let feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
        feedbackList = feedbackList.filter(feedback => feedback.id !== id); // Eliminar el comentario por ID
        localStorage.setItem("feedbackList", JSON.stringify(feedbackList)); // Actualizar localStorage
        displayFeedback(); // Actualizar la lista de comentarios
    } catch (error) {
        console.error("Error al eliminar el comentario:", error);
        alert("Hubo un error al eliminar el comentario. Por favor, intenta de nuevo.");
    }
}

// Función para limpiar el formulario de comentarios
function clearFeedbackForm() {
    document.getElementById("feedback-first-name").value = '';
    document.getElementById("feedback-last-name").value = '';
    document.getElementById("feedback-email").value = '';
    document.getElementById("feedback-rating").value = '';
    document.getElementById("feedback-comment").value = '';
}

// Función para mostrar/ocultar los botones según el estado
function updateButtonVisibility() {
    const deleteButton = document.getElementById('toggle-delete-button');
    const resetButton = document.getElementById('reset-feedback-button');

    // Mostrar/ocultar el botón de eliminar
    deleteButton.style.display = canDelete ? 'inline-block' : 'none';

    // Mostrar/ocultar el botón de reinicio solo si es administrador
    resetButton.style.display = isAdmin ? 'inline-block' : 'none';

    // Actualizar la visibilidad de los botones de eliminar en cada comentario
    const feedbackListElement = document.getElementById("feedback-list");
    const deleteButtons = feedbackListElement.querySelectorAll("button");
    deleteButtons.forEach(button => {
        button.style.display = isAdmin && canDelete ? "inline" : "none";
    });
}

// Función para habilitar/deshabilitar la capacidad de eliminar
function toggleDeleteFeature() {
    canDelete = !canDelete; // Cambiar el estado de canDelete
    updateButtonVisibility(); // Actualizar la visibilidad de los botones
}

// Función para resetear la lista de comentarios
function resetFeedbackList() {
    if (confirm("¿Estás seguro de que deseas reiniciar la lista de comentarios? Esta acción no se puede deshacer.")) {
        localStorage.removeItem("feedbackList");
        document.getElementById('feedback-list').innerHTML = "";
        displayFeedback(); // Mostrar la lista de comentarios actualizada
        alert("La lista de comentarios ha sido reiniciada.");
    }
}

// Cargar los comentarios cuando la página se carga
window.onload = () => {
    displayFeedback();

    // Inicializar estado de botones
    const toggleButton = document.getElementById("toggle-delete-button");
    toggleButton.innerText = canDelete ? "Deshabilitar función de eliminar" : "Habilitar función de eliminar";
};

// Función para iniciar los botones al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    updateButtonVisibility(); // Asegurar que los botones se muestren correctamente
});
