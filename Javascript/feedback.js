// Initial number of reviews to show
const reviewsToShow = 8;

// Variables to control admin status and delete capability
let isAdmin = false;
let canDelete = false;
const hashedAdminPassword = "drowssap";

// Function to toggle admin controls visibility
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

// Function to toggle admin mode
function toggleAdminMode() {
    isAdmin = !isAdmin;
    canDelete = isAdmin;
    updateAdminControlsVisibility();
}

// Hash function to simulate password encryption
function hashPassword(password) {
    return password.split('').reverse().join('');
}

// Function to update admin controls visibility
function updateAdminControlsVisibility() {
    const deleteButtons = document.querySelectorAll('.delete-feedback-button');
    deleteButtons.forEach(button => {
        button.style.display = (isAdmin && canDelete) ? 'inline-flex' : 'none';
    });
}

// Function to toggle delete capability
function toggleDelete() {
    if (!isAdmin) return;
    canDelete = !canDelete;
    updateAdminControlsVisibility();
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

// Function to update pagination buttons
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

// Function to display feedback
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

// Initialize when page loads and add sample reviews if needed
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initial state - isAdmin:', isAdmin, 'canDelete:', canDelete);
    
    // Check if we already have feedback data
    let feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
    
    // Only add sample reviews if the feedback list is empty
    if (feedbackList.length === 0) {
        // Sample review 1
        const johnathanReview = {
            id: "sample-review-1",
            firstName: "Johnathan",
            lastName: "Mitchell",
            serviceType: "BBS Database Solutions",
            rating: 5,
            comment: "Before we found BBS, our e-commerce site was a mess. Inventory was all over the place, and our customers weren't happy. Our MySQL database just couldn't keep up. But then we switched to BBS's solution, integrated it with our PHP backend, and wow, what a difference! The transition was super fast and incredibly easy. From day one, we saw amazing results. Our inventory is now perfectly managed, and our operational costs have dropped significantly. Plus, the system is so user-friendly that our team adapted in no time. Thanks to BBS, our revenue has shot up by 30% in just a few months. The personalized customer experience we can now offer has boosted retention and satisfaction. Every e-commerce business should have a database solution like this. It's been a game-changer for us!"
        };

        // Sample review 2
        const elizabethReview = {
            id: "sample-review-2",
            firstName: "Elizabeth",
            lastName: "Roberts",
            serviceType: "BBS Database Solutions",
            rating: 5,
            comment: "Before we implemented BBS's database solution, our clinic was really struggling. Long wait times and messy patient records were a daily headache. I wanted a MySQL database that could be transitioned to Oracle, and BBS helped us create a database tailored specifically to our clinic's needs. Their communication was excellent—they truly listened to our requirements and were incredibly supportive throughout the process. With seamless help from our backend team, the transition was amazingly smooth. Delivery was even faster than expected, and the results were noticeable right from the start. Now, our medical teams have instant access to organized, real-time information, which has significantly boosted our efficiency. Wait times are down, patient satisfaction is up, and our ratings reflect this transformation! Data security is also a top priority for us, and BBS has been invaluable in ensuring everything is safeguarded. This investment has genuinely transformed our clinic, creating a better environment for both our patients and staff 😊"
        };

        // Add sample reviews to the feedback list
        feedbackList.unshift(elizabethReview, johnathanReview);
        localStorage.setItem("feedbackList", JSON.stringify(feedbackList));
    }
    
    // Display all feedback and update admin controls
    displayFeedback();
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

