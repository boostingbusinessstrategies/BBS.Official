// Initial number of reviews to show
const reviewsToShow = 8;

// Variables to control admin status and delete capability
let isAdmin = false; // Cambiar a false para ocultar los controles de administrador inicialmente
let canDelete = false; // Inicialmente no se puede eliminar
const hashedAdminPassword = "drowssap"; // La contraseña encriptada (simulada aquí)

// Function to toggle admin controls visibility
function toggleAdminControls() {
    const password = prompt("Please enter admin password:");
    if (hashPassword(password) === hashedAdminPassword) {
        isAdmin = true;
        canDelete = true; // Activar la capacidad de eliminar cuando se ingrese la contraseña correcta
        updateAdminControlsVisibility();
        alert("Admin mode activated");
    } else {
        alert("Incorrect password");
    }
}

// Function to toggle admin mode
function toggleAdminMode() {
    isAdmin = !isAdmin;
    canDelete = isAdmin; // Desactivar la capacidad de eliminar cuando se desactive el modo administrador
    updateAdminControlsVisibility();
}

// Hash function to simulate password encryption (in a real implementation, you should use a proper hashing library)
function hashPassword(password) {
    // Simple hash function for demonstration purposes
    return password.split('').reverse().join('');
}

// Function to update admin controls visibility
function updateAdminControlsVisibility() {
    const deleteButtons = document.querySelectorAll('.delete-feedback-button');

    // Mostrar los botones de eliminar solo si el admin ha iniciado sesión
    deleteButtons.forEach(button => {
        button.style.display = (isAdmin && canDelete) ? 'inline-flex' : 'none';
    });
}

// Function to toggle delete capability
function toggleDelete() {
    if (!isAdmin) return;
    canDelete = !canDelete; // Toggle delete capability
    updateAdminControlsVisibility(); // Update button visibility
}

// Function to delete specific feedback
function deleteFeedback(id) {
    if (!isAdmin || !canDelete) {
        alert("You must be an admin with delete privileges to remove feedback.");
        return;
    }

    if (confirm("Are you sure you want to delete this feedback?")) {
        try {
            let feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
            feedbackList = feedbackList.filter(feedback => feedback.id !== id);
            localStorage.setItem("feedbackList", JSON.stringify(feedbackList));
            displayFeedback(); // Re-render feedback list
            alert("Feedback deleted successfully.");
        } catch (error) {
            console.error("Error deleting feedback:", error);
            alert("There was an error deleting the feedback. Please try again.");
        }
    }
}

// Function to update pagination buttons (added for pagination)
function updatePaginationButtons(totalReviews) {
    const totalPages = Math.ceil(totalReviews / reviewsToShow);
    const paginationElement = document.getElementById("pagination");
    paginationElement.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.onclick = () => changePage(i);
        paginationElement.appendChild(button);
    }
}

// Function to change page for pagination
function changePage(page) {
    const feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
    const feedbackListElement = document.getElementById("feedback-list");
    feedbackListElement.innerHTML = "";

    const startIndex = (page - 1) * reviewsToShow;
    const endIndex = page * reviewsToShow;
    const reviewsToDisplay = feedbackList.slice(startIndex, endIndex);

    reviewsToDisplay.forEach((feedback) => {
        const feedbackItem = document.createElement("li");
        feedbackItem.id = `feedback-item-${feedback.id}`;
        feedbackItem.innerHTML = 
            `<div><strong>${feedback.firstName} ${feedback.lastName}</strong></div>
            <div><em>Service Type: ${feedback.serviceType}</em></div>
            <div class="rating">${'⭐'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)}</div>
            <div>${feedback.comment}</div>
            <button class="delete-feedback-button" style="display: ${(isAdmin && canDelete) ? 'inline-flex' : 'none'}" onclick="deleteFeedback('${feedback.id}')">Delete</button>`;
        feedbackListElement.appendChild(feedbackItem);
    });

    updatePaginationButtons(feedbackList.length);
}

// Function to display feedback (with pagination)
function displayFeedback() {
    const feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
    const feedbackListElement = document.getElementById("feedback-list");
    feedbackListElement.innerHTML = "";

    const reviewsToDisplay = feedbackList.slice(0, reviewsToShow);

    reviewsToDisplay.forEach((feedback) => {
        const feedbackItem = document.createElement("li");
        feedbackItem.id = `feedback-item-${feedback.id}`;
        feedbackItem.innerHTML = 
            `<div><strong>${feedback.firstName} ${feedback.lastName}</strong></div>
            <div><em>Service Type: ${feedback.serviceType}</em></div>
            <div class="rating">${'⭐'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)}</div>
            <div>${feedback.comment}</div>
            <button class="delete-feedback-button" style="display: ${(isAdmin && canDelete) ? 'inline-flex' : 'none'}" onclick="deleteFeedback('${feedback.id}')">Delete</button>`;
        feedbackListElement.appendChild(feedbackItem);
    });

    updatePaginationButtons(feedbackList.length);
}

// Function to submit feedback
function submitFeedback(event) {
    event.preventDefault();

    const firstName = document.getElementById("feedback-first-name").value.trim();
    const lastName = document.getElementById("feedback-last-name").value.trim();
    const serviceType = document.getElementById("service-type").value;
    const rating = document.getElementById("feedback-rating").value;
    const comment = document.getElementById("feedback-comment").value.trim();

    if (!firstName || !lastName || !serviceType || !rating || !comment) {
        alert("Please complete all fields before submitting.");
        return;
    }

    const feedback = {
        id: Date.now().toString(),
        firstName: firstName,
        lastName: lastName,
        serviceType: serviceType,
        rating: parseInt(rating, 10),
        comment: comment
    };

    try {
        let feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
        feedbackList.push(feedback);
        localStorage.setItem("feedbackList", JSON.stringify(feedbackList));

        clearFeedbackForm();
        displayFeedback();
        alert("Thank you for your feedback!");
    } catch (error) {
        console.error("Error saving feedback:", error);
        alert("There was an error saving your feedback. Please try again.");
    }
}

// Function to clear the form
function clearFeedbackForm() {
    document.getElementById("feedback-first-name").value = "";
    document.getElementById("feedback-last-name").value = "";
    document.getElementById("service-type").value = "";
    document.getElementById("feedback-rating").value = "";
    document.getElementById("feedback-comment").value = "";
}

// Function to reset feedback list
function resetFeedbackList() {
    if (!isAdmin) {
        alert("You must be an admin to reset the feedback list.");
        return;
    }

    if (confirm("Are you sure you want to reset the feedback list? This action cannot be undone.")) {
        localStorage.removeItem("feedbackList");
        displayFeedback();
        alert("Feedback list has been reset successfully.");
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initial state - isAdmin:', isAdmin, 'canDelete:', canDelete);
    displayFeedback();
    updateAdminControlsVisibility(); // Los controles de administrador están ocultos por defecto
});





document.addEventListener('DOMContentLoaded', function() {
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





  if (navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2) {
    document.documentElement.classList.add('low-performance');
}

document.addEventListener('DOMContentLoaded', function() {
    const isLowPerformance = navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2;
    
    if (isLowPerformance) {
        document.documentElement.classList.add('low-performance');
    }
});

