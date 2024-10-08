// Initial number of reviews to show
const reviewsToShow = 8;

// Variables to control admin status and delete capability
let isAdmin = false;
let canDelete = false;
let adminPassword = "admin123"; // Change this to your desired password

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
    const deleteButtons = document.querySelectorAll('.delete-feedback-button');
    deleteButtons.forEach(button => {
        button.style.display = (isAdmin && canDelete) ? 'inline-flex' : 'none';
    });
}

// Function to show/hide buttons based on state
function updateButtonVisibility() {
    const deleteButtons = document.querySelectorAll('.delete-feedback-button');
    const toggleDeleteButton = document.getElementById('toggle-delete-button');
    const resetButton = document.getElementById('reset-feedback-button');

    if (toggleDeleteButton) {
        toggleDeleteButton.textContent = canDelete ? 'Disable Delete Function' : 'Enable Delete Function';
    }

    deleteButtons.forEach(button => {
        button.style.display = (isAdmin && canDelete) ? 'inline-flex' : 'none';
    });
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
    const email = document.getElementById("feedback-email").value.trim();
    const rating = document.getElementById("feedback-rating").value;
    const comment = document.getElementById("feedback-comment").value.trim();

    if (!firstName || !lastName || !email || !rating || !comment) {
        alert("Please complete all fields before submitting.");
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    const feedback = {
        id: Date.now().toString(),
        firstName: firstName,
        lastName: lastName,
        email: email,
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

// Function to delete feedback
function deleteFeedback(id) {
    if (!isAdmin) {
        alert("You don't have permission to delete feedback.");
        return;
    }

    if (!canDelete) {
        alert("Delete function is currently disabled.");
        return;
    }

    if (confirm("Are you sure you want to delete this feedback?")) {
        try {
            let feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
            feedbackList = feedbackList.filter(feedback => feedback.id !== id);
            localStorage.setItem("feedbackList", JSON.stringify(feedbackList));
            displayFeedback();
        } catch (error) {
            console.error("Error deleting feedback:", error);
            alert("There was an error deleting the feedback. Please try again.");
        }
    }
}

// Function to clear feedback form
function clearFeedbackForm() {
    document.getElementById("feedback-first-name").value = '';
    document.getElementById("feedback-last-name").value = '';
    document.getElementById("feedback-email").value = '';
    document.getElementById("feedback-rating").value = '';
    document.getElementById("feedback-comment").value = '';
}

// Function to toggle delete capability
function toggleDeleteFeature() {
    if (!isAdmin) {
        alert("You must be an admin to toggle delete functionality.");
        return;
    }
    canDelete = !canDelete;
    updateButtonVisibility();
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

    updateAdminControlsVisibility();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initial state - isAdmin:', isAdmin, 'canDelete:', canDelete);
    displayFeedback();
    updateAdminControlsVisibility();
});

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
