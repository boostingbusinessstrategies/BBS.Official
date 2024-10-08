// Number of reviews to show initially
const reviewsToShow = 8;

// Variable to determine if the user is an admin
let isAdmin = true; // Change to false if you do not want full access

// Variable to determine if the delete feature is enabled
let canDelete = false; // Change to true to enable the delete feature

// Function to load more reviews
function showMoreReviews() {
    const feedbackListElement = document.getElementById("feedback-list");
    const feedbackItems = feedbackListElement.querySelectorAll("li");

    // Show additional reviews
    for (let i = reviewsToShow; i < feedbackItems.length; i++) {
        feedbackItems[i].style.display = "list-item";
    }

    // Hide the "Show More Reviews" button after showing more reviews
    document.getElementById("show-more-reviews").style.display = "none";
}

// Function to display feedback, limited to the initially visible reviews
function displayFeedback() {
    const feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
    const feedbackListElement = document.getElementById("feedback-list");

    // Clear the feedback list
    feedbackListElement.innerHTML = "";

    // Create feedback elements and add them to the list
    feedbackList.forEach((feedback) => {
        const feedbackItem = document.createElement("li");
        feedbackItem.style.display = feedbackListElement.childElementCount < reviewsToShow ? "list-item" : "none"; // Show only the first reviews
        feedbackItem.innerHTML = `
            <div>${feedback.firstName} ${feedback.lastName}</div>
            <div class="rating">${'⭐'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)}</div>
            <div>${feedback.comment}</div>
            ${isAdmin && canDelete ? `<button onclick="deleteFeedback('${feedback.id}')">Delete</button>` : ''}
        `;
        feedbackListElement.appendChild(feedbackItem);
    });

    // Show the "Show More Reviews" button only if there are more reviews than the limit
    document.getElementById("show-more-reviews").style.display = feedbackList.length > reviewsToShow ? "block" : "none";

    // Control visibility of Enable/Disable button
    const enableDisableButton = document.getElementById("enable-disable-button");
    enableDisableButton.style.display = isAdmin ? "inline" : "none"; // Show the button if isAdmin is true

    // Control visibility of delete buttons
    const deleteButtons = feedbackListElement.querySelectorAll("button");
    deleteButtons.forEach(button => {
        button.style.display = canDelete ? "inline" : "none"; // Show or hide based on canDelete
    });
}

// Function to submit feedback
function submitFeedback(event) {
    event.preventDefault();

    // Get values from the form
    const firstName = document.getElementById("feedback-first-name").value.trim();
    const lastName = document.getElementById("feedback-last-name").value.trim();
    const email = document.getElementById("feedback-email").value.trim(); // Get the email
    const rating = document.getElementById("feedback-rating").value;
    const comment = document.getElementById("feedback-comment").value.trim();

    // Validate fields
    if (!firstName || !lastName || !email || !rating || !comment) {
        alert("Please fill in all fields before submitting your feedback.");
        return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Create the feedback object
    const feedback = {
        id: Date.now().toString(), // Unique ID using timestamp
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

        // Update the feedback list to show the new review
        displayFeedback();

    } catch (error) {
        console.error("Error saving feedback to local storage:", error);
        alert("There was an error saving your feedback. Please try again.");
    }
}

// Function to delete feedback
function deleteFeedback(id) {
    if (!isAdmin) {
        alert("You do not have permission to delete this review.");
        return;
    }

    if (!canDelete) {
        alert("The delete feature is currently disabled.");
        return;
    }

    try {
        let feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
        feedbackList = feedbackList.filter(feedback => feedback.id !== id); // Remove the review by ID
        localStorage.setItem("feedbackList", JSON.stringify(feedbackList)); // Update localStorage
        displayFeedback(); // Update the feedback list
    } catch (error) {
        console.error("Error deleting feedback:", error);
        alert("There was an error deleting the review. Please try again.");
    }
}

// Function to toggle the delete feature
function toggleDeleteFeature() {
    canDelete = !canDelete; // Toggle the delete feature
    const toggleButton = document.getElementById("toggle-delete-button");
    toggleButton.innerText = canDelete ? "Disable Delete Feature" : "Enable Delete Feature";
    displayFeedback(); // Refresh feedback display
}

// Load feedback when the page loads
window.onload = () => {
    displayFeedback();

    // Initialize toggle button
    const toggleButton = document.getElementById("toggle-delete-button");
    toggleButton.innerText = canDelete ? "Disable Delete Feature" : "Enable Delete Feature";
};

// Sidebar functionality
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');

// Add an event listener to the menu button
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Detect clicks outside the sidebar to close it
document.addEventListener('click', (event) => {
    if (sidebar.classList.contains('active') && !sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
        sidebar.classList.remove('active');
    }
});

// Close the sidebar when clicking on links
const sidebarLinks = sidebar.querySelectorAll('ul li a');
sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });
});

// Clear feedback form function
function clearFeedbackForm() {
    document.getElementById("feedback-first-name").value = '';
    document.getElementById("feedback-last-name").value = '';
    document.getElementById("feedback-email").value = '';
    document.getElementById("feedback-rating").value = '';
    document.getElementById("feedback-comment").value = '';
        }
