document.addEventListener('DOMContentLoaded', function () {
    const contactReason = document.getElementById('contact-reason');
    const extensionOptions = document.getElementById('extension-options');
    const modificationOptions = document.getElementById('modification-options');

    // Hide both blocks when loading the page
    extensionOptions.style.display = 'none';
    modificationOptions.style.display = 'none';

    contactReason.addEventListener('change', function () {
        const selectedValue = contactReason.value;
        console.log('Selected Value:', selectedValue); // For debugging

        // Show or hide sections based on selection
        if (selectedValue === 'expand_database') {
            extensionOptions.style.display = 'block';
            modificationOptions.style.display = 'none';
        } else if (selectedValue === 'modify_database') {
            extensionOptions.style.display = 'none';
            modificationOptions.style.display = 'block';
        } else {
            extensionOptions.style.display = 'none';
            modificationOptions.style.display = 'none';
        }
    });


    // Sidebar functionality
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
