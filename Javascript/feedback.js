// Configuración inicial
const JSONBIN_API_KEY = "$2a$10$aQJJ/daSpPBhfxtYeZ6NXOReCvNjP.ht06bkRi.nhhb3rp.oJp9Ym";
const BIN_ID = "$2a$10$5wjRE677Hum6aMy.OxvWweJkgqh9cl/hBAepHn/nOqpcZJEdO2dQK";
const reviewsToShow = 8;

// Estado del modo administrador y capacidad de eliminar
let isAdmin = false;
let canDelete = false;
const hashedAdminPassword = "drowssap";
let feedbackList = [];

// Función de validación
function validateFeedbackForm(formData) {
    const errors = [];
    
    if (!formData.firstName.trim()) {
        errors.push("First name is required");
    } else if (formData.firstName.length < 2) {
        errors.push("First name must be at least 2 characters long");
    }
    
    if (!formData.lastName.trim()) {
        errors.push("Last name is required");
    } else if (formData.lastName.length < 2) {
        errors.push("Last name must be at least 2 characters long");
    }
    
    if (!formData.serviceType || formData.serviceType === "select") {
        errors.push("Please select a service type");
    }
    
    const rating = parseInt(formData.rating, 10);
    if (isNaN(rating) || rating < 1 || rating > 5) {
        errors.push("Please provide a valid rating between 1 and 5");
    }
    
    if (!formData.comment.trim()) {
        errors.push("Comment is required");
    } else if (formData.comment.length < 10) {
        errors.push("Comment must be at least 10 characters long");
    }
    
    return errors;
}

// Función para mostrar mensajes
function showMessage(type, message, formElement, duration = 5000) {
    const existingMessages = formElement.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}-message`;
    messageElement.textContent = message;
    
    formElement.insertBefore(messageElement, formElement.querySelector('button[type="submit"]'));
    
    setTimeout(() => {
        if (messageElement.parentNode === formElement) {
            messageElement.remove();
        }
    }, duration);
}

// Función para cargar feedback
async function loadFeedback() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: {
                'X-Master-Key': JSONBIN_API_KEY
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        feedbackList = data.record || [];
        displayFeedback();
    } catch (error) {
        console.error("Error loading feedback:", error);
        const feedbackList = document.getElementById("feedback-list");
        if (feedbackList) {
            feedbackList.innerHTML = `
                <div class="error-message">
                    Unable to load reviews. Please try again later.
                    <button onclick="loadFeedback()" class="retry-button">Retry</button>
                </div>`;
        }
    }
}

// Función para guardar feedback
async function saveFeedback() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY
            },
            body: JSON.stringify(feedbackList)
        });
        
        return response.ok;
    } catch (error) {
        console.error("Error saving feedback:", error);
        return false;
    }
}

// Función para enviar feedback
async function submitFeedback(event) {
    event.preventDefault();
    
    const form = document.getElementById("feedback-form");
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (!form || !submitButton) return;
    
    try {
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        const formData = {
            firstName: document.getElementById("feedback-first-name").value.trim(),
            lastName: document.getElementById("feedback-last-name").value.trim(),
            serviceType: document.getElementById("service-type").value,
            rating: document.getElementById("feedback-rating").value,
            comment: document.getElementById("feedback-comment").value.trim()
        };
        
        const validationErrors = validateFeedbackForm(formData);
        
        if (validationErrors.length > 0) {
            throw new Error(validationErrors.join('\n'));
        }
        
        const feedback = {
            id: Date.now().toString(),
            ...formData,
            rating: parseInt(formData.rating, 10)
        };
        
        feedbackList.push(feedback);
        const saveSuccess = await saveFeedback();
        
        if (!saveSuccess) {
            throw new Error("Failed to save feedback. Please try again.");
        }
        
        form.reset();
        displayFeedback();
        showMessage('success', 'Thank you for your feedback!', form);
        
    } catch (error) {
        console.error("Error in submitFeedback:", error);
        showMessage('error', error.message, form);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Feedback';
    }
}

// Funciones de administrador
function toggleAdminControls() {
    const password = prompt("Please enter admin password:");
    if (hashPassword(password) === hashedAdminPassword) {
        isAdmin = true;
        canDelete = true;
        updateAdminControlsVisibility();
        alert("Admin mode activated");
    } else {
        alert("Incorrect password");
    }
}

function hashPassword(password) {
    return password.split('').reverse().join('');
}

function updateAdminControlsVisibility() {
    const deleteButtons = document.querySelectorAll('.delete-feedback-button');
    deleteButtons.forEach(button => {
        button.style.display = (isAdmin && canDelete) ? 'inline-flex' : 'none';
    });
}

function toggleDelete() {
    if (!isAdmin) return;
    canDelete = !canDelete;
    updateAdminControlsVisibility();
}

// Función para eliminar feedback
function deleteFeedback(id) {
    if (!isAdmin || !canDelete) {
        alert("You must be an admin with delete privileges to remove feedback.");
        return;
    }

    if (confirm("Are you sure you want to delete this feedback?")) {
        feedbackList = feedbackList.filter(feedback => feedback.id !== id);
        saveFeedback();
        displayFeedback();
    }
}

// Funciones de paginación
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

function changePage(page) {
    const feedbackListElement = document.getElementById("feedback-list");
    feedbackListElement.innerHTML = "";

    const startIndex = (page - 1) * reviewsToShow;
    const endIndex = page * reviewsToShow;
    const reviewsToDisplay = feedbackList.slice(startIndex, endIndex);

    reviewsToDisplay.forEach((feedback) => {
        const feedbackItem = document.createElement("li");
        feedbackItem.id = `feedback-item-${feedback.id}`;
        feedbackItem.innerHTML = `
            <div><strong>${feedback.firstName} ${feedback.lastName}</strong></div>
            <div><em>Service Type: ${feedback.serviceType}</em></div>
            <div class="rating">${'⭐'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)}</div>
            <div>${feedback.comment}</div>
            <button class="delete-feedback-button" style="display: ${(isAdmin && canDelete) ? 'inline-flex' : 'none'}" onclick="deleteFeedback('${feedback.id}')">Delete</button>`;
        feedbackListElement.appendChild(feedbackItem);
    });

    updatePaginationButtons(feedbackList.length);
}

// Función para mostrar feedback
function displayFeedback() {
    const feedbackListElement = document.getElementById("feedback-list");
    feedbackListElement.innerHTML = "";

    const reviewsToDisplay = feedbackList.slice(0, reviewsToShow);

    reviewsToDisplay.forEach((feedback) => {
        const feedbackItem = document.createElement("li");
        feedbackItem.id = `feedback-item-${feedback.id}`;
        feedbackItem.innerHTML = `
            <div><strong>${feedback.firstName} ${feedback.lastName}</strong></div>
            <div><em>Service Type: ${feedback.serviceType}</em></div>
            <div class="rating">${'⭐'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)}</div>
            <div>${feedback.comment}</div>
            <button class="delete-feedback-button" style="display: ${(isAdmin && canDelete) ? 'inline-flex' : 'none'}" onclick="deleteFeedback('${feedback.id}')">Delete</button>`;
        feedbackListElement.appendChild(feedbackItem);
    });

    updatePaginationButtons(feedbackList.length);
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("feedback-form");
    if (form) {
        form.addEventListener('submit', submitFeedback);
        
        // Validación en tiempo real
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                const formData = {
                    firstName: document.getElementById("feedback-first-name").value.trim(),
                    lastName: document.getElementById("feedback-last-name").value.trim(),
                    serviceType: document.getElementById("service-type").value,
                    rating: document.getElementById("feedback-rating").value,
                    comment: document.getElementById("feedback-comment").value.trim()
                };
                
                const errors = validateFeedbackForm(formData);
                const submitButton = form.querySelector('button[type="submit"]');
                submitButton.disabled = errors.length > 0;
            });
        });
    }
    
    loadFeedback();
    updateAdminControlsVisibility();
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
