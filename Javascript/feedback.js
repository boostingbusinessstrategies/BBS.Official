// Initial number of reviews to show
const reviewsToShow = 8;

// Variables to control admin status and delete capability
let isAdmin = false; // Cambiar a false para ocultar los controles de administrador inicialmente
let canDelete = true;
let adminPassword = "admin123"; // Cambia esto a tu contraseña deseada

// Function to toggle admin controls visibility
function toggleAdminControls() {
    const password = prompt("Please enter admin password:");
    if (password === adminPassword) {
        isAdmin = !isAdmin;
        updateAdminControlsVisibility();
        alert(isAdmin ? "Admin mode activated" : "Admin mode deactivated");
    } else {
        alert("Incorrect password");
    }
}

// Function to update admin controls visibility
function updateAdminControlsVisibility() {
    const adminControls = document.getElementById('admin-controls');
    if (adminControls) {
        adminControls.style.display = isAdmin ? 'flex' : 'none';
    }
    
    // Update delete buttons visibility in existing feedback
    updateButtonVisibility();
}

// Function to toggle delete capability
function toggleDelete() {
    if (!isAdmin) return;
    canDelete = !canDelete; // Toggle delete capability
    updateButtonVisibility(); // Update button visibility
}

// Function to show/hide buttons based on state
function updateButtonVisibility() {
    const deleteButtons = document.querySelectorAll('.delete-feedback-button');
    const toggleDeleteButton = document.getElementById('toggle-delete-button');

    if (toggleDeleteButton) {
        toggleDeleteButton.textContent = canDelete ? 'Disable Delete Function' : 'Enable Delete Function';
    }

    deleteButtons.forEach(button => {
        // Change visibility of delete buttons based on state
        button.style.display = (isAdmin && canDelete) ? 'inline-flex' : 'none';
    });
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
            displayFeedback();
            alert("Feedback deleted successfully.");
        } catch (error) {
            console.error("Error deleting feedback:", error);
            alert("There was an error deleting the feedback. Please try again.");
        }
    }
}

// Function to show more reviews
function showMoreReviews() {
    const feedbackListElement = document.getElementById("feedback-list");
    const feedbackItems = feedbackListElement.querySelectorAll("li");

    for (let i = reviewsToShow; i < feedbackItems.length; i++) {
        feedbackItems[i].style.display = "list-item";
    }

    const showMoreButton = document.getElementById("show-more-reviews");
    if (showMoreButton) {
        showMoreButton.style.display = "none";
    }
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
        
        // Submit the form via FormSubmit
        document.getElementById("feedback-form").submit();

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

// Function to display feedback
function displayFeedback() {
    const feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
    const feedbackListElement = document.getElementById("feedback-list");

    if (!feedbackListElement) {
        console.error("Feedback list element not found");
        return;
    }

    feedbackListElement.innerHTML = "";

    feedbackList.forEach((feedback) => {
        const feedbackItem = document.createElement("li");
        feedbackItem.style.display = feedbackListElement.childElementCount < reviewsToShow ? "list-item" : "none";
        feedbackItem.innerHTML = `
            <div>${feedback.firstName} ${feedback.lastName}</div>
            <div>Service Type: ${feedback.serviceType}</div>
            <div class="rating">${'⭐'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)}</div>
            <div>${feedback.comment}</div>
            <button class="delete-feedback-button" onclick="deleteFeedback('${feedback.id}')" style="display: none;">
                <i class="fas fa-trash"></i> Delete
            </button>
        `;
        feedbackListElement.appendChild(feedbackItem);
    });

    const showMoreButton = document.getElementById("show-more-reviews");
    if (showMoreButton) {
        showMoreButton.style.display = feedbackList.length > reviewsToShow ? "block" : "none";
    }

    // Update the visibility of admin controls
    updateAdminControlsVisibility();
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
