// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
        event.preventDefault();
        document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

// Feedback handling
const feedbackForm = document.getElementById("feedback-form");
const feedbackListElement = document.getElementById("feedback-list");
const thankYouModal = document.getElementById("thank-you-modal");

feedbackForm.addEventListener('submit', submitFeedback);

function submitFeedback(event) {
    event.preventDefault();

    const feedback = {
        firstName: feedbackForm["feedback-first-name"].value,
        lastName: feedbackForm["feedback-last-name"].value,
        rating: feedbackForm["feedback-rating"].value,
        comment: feedbackForm["feedback-comment"].value,
        date: new Date().toLocaleDateString()
    };

    // Store feedback in local storage
    const feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
    feedbackList.push(feedback);
    localStorage.setItem("feedbackList", JSON.stringify(feedbackList));

    displayFeedback();
    feedbackForm.reset();
    showThankYouModal();
}

function displayFeedback() {
    const feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
    feedbackListElement.innerHTML = feedbackList.map(feedback => `
        <li>
            <strong>${feedback.firstName} ${feedback.lastName}</strong>
            <div class="rating">${"⭐".repeat(feedback.rating)}</div>
            <p>${feedback.comment}</p>
            <small>${feedback.date}</small>
        </li>
    `).join('');
}

function showThankYouModal() {
    thankYouModal.style.display = "block";
    setTimeout(() => { thankYouModal.style.display = "none"; }, 3000);
}

function redirectToPayPal() {
    const formData = new FormData(document.getElementById("database-form"));
    sessionStorage.setItem("formData", JSON.stringify(Object.fromEntries(formData)));
    window.location.href = "https://www.paypal.me/AaronObando505";
}

// Initialize on window load
window.onload = () => {
    displayFeedback();

    // Form submissions handling
    document.querySelectorAll('form').forEach(form => {
        if (form.id !== 'feedback-form') {
            form.addEventListener('submit', event => {
                event.preventDefault();
                showThankYouModal();
            });
        }
    });

    // Check PayPal return
    if (sessionStorage.getItem("formData")) {
        showThankYouModal();
        sessionStorage.removeItem("formData");
    }

    // Sidebar animation
    const sidebarLinks = document.querySelectorAll("#sidebar ul li a");
    sidebarLinks.forEach(link => {
        link.addEventListener("mouseenter", () => {
            link.style.transform = "translateX(10px)";
        });
        link.addEventListener("mouseleave", () => {
            link.style.transform = "translateX(0)";
        });
    });
};
