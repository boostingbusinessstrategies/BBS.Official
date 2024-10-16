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

  function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
      var windowHeight = window.innerHeight;
      var elementTop = reveals[i].getBoundingClientRect().top;
      var elementVisible = 150;
      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("active");
      } else {
        reveals[i].classList.remove("active");
      }
    }
  }

  window.addEventListener("scroll", reveal);
  reveal(); // Call once to check for elements in view on page load
