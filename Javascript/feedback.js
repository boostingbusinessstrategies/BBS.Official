// Configuración de JSONBin
const JSONBIN_API_KEY = "$2a$10$aQJJ/daSpPBhfxtYeZ6NXOReCvNjP.ht06bkRi.nhhb3rp.oJp9Ym";
const BIN_ID = "$2a$10$5wjRE677Hum6aMy.OxvWweJkgqh9cl/hBAepHn/nOqpcZJEdO2dQK";

// Estado del modo administrador y capacidad de eliminar
let isAdmin = false;
let canDelete = false;
const hashedAdminPassword = "drowssap";
let feedbackList = [];

// Cargar reseñas - Mejorado con manejo de errores y caché
async function loadFeedback() {
    try {
        // Implementar sistema de caché para reducir llamadas al API
        const cacheExpiry = 5 * 60 * 1000; // 5 minutos
        const cachedData = sessionStorage.getItem('cachedFeedback');
        const cacheTimestamp = sessionStorage.getItem('feedbackCacheTimestamp');
        
        if (cachedData && cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < cacheExpiry) {
            feedbackList = JSON.parse(cachedData);
            console.log("Usando datos en caché");
            displayFeedback();
            return;
        }

        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            method: 'GET',
            headers: {
                'X-Master-Key': JSONBIN_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        feedbackList = data.record || [];
        
        // Actualizar caché
        sessionStorage.setItem('cachedFeedback', JSON.stringify(feedbackList));
        sessionStorage.setItem('feedbackCacheTimestamp', Date.now().toString());
        
        displayFeedback();
    } catch (error) {
        console.error("Error loading feedback:", error);
        // Mostrar mensaje de error al usuario
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Unable to load reviews. Please try again later.';
        document.getElementById("feedback-list").appendChild(errorMessage);
    }
}

// Guardar reseñas - Mejorado con retry y validación
async function saveFeedback(retryCount = 3) {
    try {
        // Validar datos antes de guardar
        if (!Array.isArray(feedbackList)) {
            throw new Error('Invalid feedback data structure');
        }

        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY
            },
            body: JSON.stringify(feedbackList)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save feedback');
        }

        // Actualizar caché después de guardar exitosamente
        sessionStorage.setItem('cachedFeedback', JSON.stringify(feedbackList));
        sessionStorage.setItem('feedbackCacheTimestamp', Date.now().toString());
        
    } catch (error) {
        console.error("Error saving feedback:", error);
        
        if (retryCount > 0) {
            console.log(`Retrying save... (${retryCount} attempts remaining)`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
            return saveFeedback(retryCount - 1);
        }
        
        throw new Error('Failed to save feedback after multiple attempts');
    }
}

// Mejorada la función de envío de feedback
async function submitFeedback(event) {
    
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    
    try {
        const firstName = document.getElementById("feedback-first-name").value.trim();
        const lastName = document.getElementById("feedback-last-name").value.trim();
        const serviceType = document.getElementById("service-type").value;
        const rating = document.getElementById("feedback-rating").value;
        const comment = document.getElementById("feedback-comment").value.trim();

        // Validación mejorada
        if (!firstName || !lastName || !serviceType || !rating || !comment) {
            throw new Error("Please complete all fields before submitting.");
        }

        if (comment.length < 10) {
            throw new Error("Please provide a more detailed comment (minimum 10 characters).");
        }

        const feedback = {
            id: crypto.randomUUID(), // Usar UUID para IDs únicos
            firstName: firstName,
            lastName: lastName,
            serviceType: serviceType,
            rating: parseInt(rating, 10),
            comment: comment,
            timestamp: new Date().toISOString()
        };

        feedbackList.push(feedback);
        await saveFeedback();
        
        // Actualizar UI
        clearFeedbackForm();
        await loadFeedback(); // Recargar para asegurar sincronización
        
        // Mostrar mensaje de éxito
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Thank you for your feedback!';
        document.getElementById("feedback-form").appendChild(successMessage);
        
        setTimeout(() => successMessage.remove(), 3000);
        
    } catch (error) {
        console.error("Error in submitFeedback:", error);
        alert(error.message || "There was an error saving your feedback. Please try again.");
    } finally {
        submitButton.disabled = false;
    }
}

// Rest of the original code remains unchanged
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

function toggleAdminMode() {
    isAdmin = !isAdmin;
    canDelete = isAdmin;
    updateAdminControlsVisibility();
}

function hashPassword(password) {
    return password.split('').reverse().join('');
}

function updateAdminControlsVisibility() {
    console.log("Updating admin controls visibility");
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

function deleteFeedback(id) {
    if (!isAdmin || !canDelete) {
        alert("You must be an admin with delete privileges to remove feedback.");
        return;
    }

    if (confirm("Are you sure you want to delete this feedback?")) {
        feedbackList = feedbackList.filter(feedback => feedback.id !== id);
        displayFeedback();
        alert("Feedback deleted successfully.");
    }
}

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

function displayFeedback() {
    console.log("Displaying feedback:", feedbackList);

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

function clearFeedbackForm() {
    document.getElementById("feedback-first-name").value = "";
    document.getElementById("feedback-last-name").value = "";
    document.getElementById("service-type").value = "";
    document.getElementById("feedback-rating").value = "";
    document.getElementById("feedback-comment").value = "";
}

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

// Inicializar sistema con comprobación de conectividad
async function initializeFeedbackSystem() {
    try {
        // Comprobar conectividad con JSONBin
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            method: 'HEAD',
            headers: {
                'X-Master-Key': JSONBIN_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error('Cannot connect to feedback system');
        }

        await loadFeedback();
        
        // Configurar auto-refresh cada 5 minutos
        setInterval(loadFeedback, 5 * 60 * 1000);
        
    } catch (error) {
        console.error("Error initializing feedback system:", error);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Unable to initialize feedback system. Please refresh the page or try again later.';
        document.getElementById("feedback-container").prepend(errorMessage);
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeFeedbackSystem();
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
