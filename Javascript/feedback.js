// Initial number of reviews to show
const reviewsToShow = 8;

// Variables to control admin status and delete capability
let isAdmin = false; // Change to true if user is admin
let canDelete = false; // Change to true if delete function is enabled

// Function to show/hide buttons based on state
function updateButtonVisibility() {
    const deleteButtons = document.querySelectorAll('.delete-feedback-button');
    const toggleDeleteButton = document.getElementById('toggle-delete-button');
    const resetButton = document.getElementById('reset-feedback-button');

    // Ensure elements exist before modifying them
    if (toggleDeleteButton) {
        toggleDeleteButton.style.display = isAdmin ? 'inline-block' : 'none';
        toggleDeleteButton.textContent = canDelete ? 'Disable delete function' : 'Enable delete function';
    }

    if (resetButton) {
        resetButton.style.display = isAdmin ? 'inline-block' : 'none';
    }

    // Update visibility of delete buttons in each review
    deleteButtons.forEach(button => {
        button.style.display = (isAdmin && canDelete) ? 'inline-block' : 'none';
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
            ${isAdmin ? `<button class="delete-feedback-button" onclick="deleteFeedback('${feedback.id}')">Delete</button>` : ''}
        `;
        feedbackListElement.appendChild(feedbackItem);
    });

    const showMoreButton = document.getElementById("show-more-reviews");
    if (showMoreButton) {
        showMoreButton.style.display = feedbackList.length > reviewsToShow ? "block" : "none";
    }

    updateButtonVisibility();
}

// Function to submit new feedback
function submitFeedback(event) {
    event.preventDefault();

    // Get form values
    const firstName = document.getElementById("feedback-first-name").value.trim();
    const lastName = document.getElementById("feedback-last-name").value.trim();
    const email = document.getElementById("feedback-email").value.trim();
    const rating = document.getElementById("feedback-rating").value;
    const comment = document.getElementById("feedback-comment").value.trim();

    // Validate fields
    if (!firstName || !lastName || !email || !rating || !comment) {
        alert("Please complete all fields before submitting the review.");
        return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Create feedback object
    const feedback = {
        id: Date.now().toString(),
        firstName: firstName,
        lastName: lastName,
        email: email,
        rating: parseInt(rating, 10),
        comment: comment
    };

    try {
        // Save feedback to localStorage
        let feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
        feedbackList.push(feedback);
        localStorage.setItem("feedbackList", JSON.stringify(feedbackList));

        // Clear the form
        clearFeedbackForm();

        // Update the feedback list
        displayFeedback();

    } catch (error) {
        console.error("Error saving feedback:", error);
        alert("There was an error saving your feedback. Please try again.");
    }
}

// Function to delete feedback
function deleteFeedback(id) {
    if (!isAdmin) {
        alert("You don't have permission to delete this review.");
        return;
    }

    if (!canDelete) {
        alert("Delete function is disabled.");
        return;
    }

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
    canDelete = !canDelete;
    updateButtonVisibility();
    console.log('Delete capability state:', canDelete); // For debugging
}

// Function to reset feedback list
function resetFeedbackList() {
    if (!isAdmin) {
        console.log('Attempted reset without admin permissions');
        return;
    }

    if (confirm("Are you sure you want to reset the feedback list? This action cannot be undone.")) {
        localStorage.removeItem("feedbackList");
        displayFeedback();
        alert("The feedback list has been reset.");
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initial state - isAdmin:', isAdmin, 'canDelete:', canDelete); // For debugging
    displayFeedback();
    updateButtonVisibility();
});
