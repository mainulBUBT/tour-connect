document.addEventListener('DOMContentLoaded', function() {
    // Get the organizer name from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const organizerName = urlParams.get('name');
    
    if (organizerName) {
        // Update the page title
        document.title = organizerName + ' - TourConnect';
        
        // Update the organizer name in the header
        const profileNameElement = document.querySelector('.organizer-profile-name');
        if (profileNameElement) {
            profileNameElement.textContent = organizerName;
        }
        
        // Update the organizer name in the page title
        const pageTitleElement = document.querySelector('.app-logo-text');
        if (pageTitleElement) {
            pageTitleElement.textContent = organizerName;
        }
        
        // Update the image alt text
        const profileImageElement = document.querySelector('.organizer-profile-avatar');
        if (profileImageElement) {
            profileImageElement.alt = organizerName;
        }
    }
    
    // Add smooth scrolling for anchor links (keeping existing functionality)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Initialize any interactive elements (keeping existing functionality)
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add interaction effects or functionality
            this.classList.add('active');
            setTimeout(() => {
                this.classList.remove('active');
            }, 200);
        });
    });
});