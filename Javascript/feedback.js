// Function to submit feedback
function submitFeedback(event) {
    event.preventDefault();

    // Get form values
    const firstName = document.getElementById("feedback-first-name").value.trim();
    const lastName = document.getElementById("feedback-last-name").value.trim();
    const rating = document.getElementById("feedback-rating").value;
    const comment = document.getElementById("feedback-comment").value.trim();

    // Validate feedback fields
    if (!firstName || !lastName || !rating || !comment) {
        alert("Please fill in all fields before submitting your feedback.");
        return;
    }

    // Create feedback object
    const feedback = {
        firstName: firstName,
        lastName: lastName,
        rating: parseInt(rating, 10), // Ensure rating is an integer
        comment: comment
    };

    // Save feedback to local storage
    let feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
    feedbackList.push(feedback);
    localStorage.setItem("feedbackList", JSON.stringify(feedbackList));

    // Show success message
    showSuccessMessage();

    // Redirect to CAPTCHA (Sumform)
    redirectToCaptcha();
}

// Function to handle redirection to CAPTCHA
function redirectToCaptcha() {
    sessionStorage.setItem('redirectAfterCaptcha', window.location.pathname);
    window.location.href = "https://www.sumform.com/captcha";
}

// Function to check if coming back from CAPTCHA and redirect to the main page
function checkCaptchaRedirect() {
    const redirectPath = sessionStorage.getItem('redirectAfterCaptcha');
    if (redirectPath) {
        sessionStorage.removeItem('redirectAfterCaptcha');
        window.location.href = "/main"; // Adjust this to your actual main page route
    }
}

// Function to display feedback
function displayFeedback() {
    const feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
    const feedbackListElement = document.getElementById("feedback-list");

    // Clear the feedback display
    feedbackListElement.innerHTML = "";

    // Add each feedback to the list
    feedbackList.forEach((feedback, index) => {
        const feedbackItem = document.createElement("li");
        feedbackItem.innerHTML = `
            <div>${feedback.firstName} ${feedback.lastName}</div>
            <div class="rating">${'⭐'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)}</div>
            <div>${feedback.comment}</div>
            <button onclick="deleteFeedback(${index})">Delete</button>
        `;
        feedbackListElement.appendChild(feedbackItem);
    });
}

// Function to delete feedback
function deleteFeedback(index) {
    let feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
    feedbackList.splice(index, 1); // Remove the feedback at the specified index
    localStorage.setItem("feedbackList", JSON.stringify(feedbackList)); // Update local storage
    displayFeedback(); // Refresh the displayed feedback list
}

// Function to show success message
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

    // Remove the success message after 3 seconds
    setTimeout(() => {
        successMessage.classList.remove("active");
        document.body.removeChild(successMessage);
    }, 3000);
}

// Load feedback when the page loads
window.onload = () => {
    displayFeedback();
    checkCaptchaRedirect(); // Check if coming back from CAPTCHA

    // Obtén referencias a los elementos
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');

// Añade un event listener al botón del menú
menuToggle.addEventListener('click', () => {
    // Alterna la clase 'active' en el sidebar
    sidebar.classList.toggle('active');
});

// Añade un event listener al documento para detectar clics fuera del sidebar
document.addEventListener('click', (event) => {
    // Si el sidebar está activo y el clic ocurre fuera del sidebar y del menú toggle
    if (sidebar.classList.contains('active') && !sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
        // Elimina la clase 'active' para cerrar el sidebar
        sidebar.classList.remove('active');
    }
});

// Añadir un event listener a los enlaces del sidebar para cerrarlo al hacer clic
const sidebarLinks = sidebar.querySelectorAll('ul li a');
sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('active'); // Cierra el sidebar al hacer clic en un enlace
    });
});
};
