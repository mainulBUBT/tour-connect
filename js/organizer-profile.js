document.addEventListener('DOMContentLoaded', function() {
    // Get the organizer name from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const organizerName = urlParams.get('name');
    
    if (organizerName) {
        // Update page title with organizer name
        document.title = organizerName + ' - TourConnect';
        
        // Update organizer name in the profile
        const profileNameElement = document.querySelector('.organizer-profile-name');
        if (profileNameElement) {
            profileNameElement.textContent = organizerName;
        }
        
        // Update header title
        const headerTitle = document.querySelector('.app-logo-text');
        if (headerTitle) {
            headerTitle.textContent = organizerName;
        }
        
        // You could add more dynamic content updates here based on the organizer name
        // For example, loading different images, descriptions, tours, etc.
        
        // This is a simplified version - in a real application, you would likely
        // fetch the organizer data from a database or API based on the name parameter
    }
});