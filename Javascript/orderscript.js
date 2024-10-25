// Function to toggle encryption options based on sensitive data permissions
function toggleEncryptionOptions(hasSensitiveData) {
    // Get encryption options
    const encryptYes = document.getElementById('encrypt-yes');
    const encryptNoOwn = document.getElementById('encrypt-no-own');
    const encryptNo = document.getElementById('encrypt-no');

    if (hasSensitiveData) {
        // Enable encryption options when sensitive data is required
        encryptYes.disabled = false;
        encryptNoOwn.disabled = false;
        encryptNo.disabled = true;  // Disable 'No sensitive data' option
    } else {
        // Disable all encryption options if no sensitive data is required
        encryptYes.disabled = true;
        encryptNoOwn.disabled = true;
        encryptNo.disabled = true;
        encryptNo.checked = true;  // Auto-check 'No sensitive data' if permissions not required
    }
}


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
