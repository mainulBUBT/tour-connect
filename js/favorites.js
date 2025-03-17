/**
 * Favorites Management for TourConnect
 * Handles adding, removing, and displaying favorite tour packages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize favorites from localStorage
    initializeFavorites();
    
    // Set up event listeners
    setupEventListeners();
});

// Pagination settings
const ITEMS_PER_PAGE = 6;
let currentPage = 1;
let totalPages = 1;

/**
 * Initialize favorites from localStorage
 */
function initializeFavorites() {
    // Get favorites from localStorage or initialize empty array
    const favorites = getFavorites();
    
    // Calculate total pages
    totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);
    
    // Update the UI based on favorites
    updateFavoritesUI(favorites);
    
    // Initialize pagination
    updatePagination();
}

/**
 * Get favorites from localStorage
 * @returns {Array} Array of favorite tour packages
 */
function getFavorites() {
    const favoritesJSON = localStorage.getItem('tourConnectFavorites');
    return favoritesJSON ? JSON.parse(favoritesJSON) : [];
}

/**
 * Save favorites to localStorage
 * @param {Array} favorites - Array of favorite tour packages
 */
function saveFavorites(favorites) {
    localStorage.setItem('tourConnectFavorites', JSON.stringify(favorites));
}

/**
 * Update the favorites UI based on current favorites
 * @param {Array} favorites - Array of favorite tour packages
 */
function updateFavoritesUI(favorites) {
    const favoritesContainer = document.getElementById('favoritesContainer');
    const emptyFavorites = document.getElementById('emptyFavorites');
    
    if (!favoritesContainer || !emptyFavorites) return; // Not on favorites page
    
    // Show empty state if no favorites
    if (favorites.length === 0) {
        favoritesContainer.classList.add('d-none');
        emptyFavorites.classList.remove('d-none');
        document.querySelector('.pagination-container')?.classList.add('d-none');
        return;
    }
    
    // Show favorites container
    favoritesContainer.classList.remove('d-none');
    emptyFavorites.classList.add('d-none');
    document.querySelector('.pagination-container')?.classList.remove('d-none');
    
    // Clear existing content
    favoritesContainer.innerHTML = '';
    
    // Calculate pagination indexes
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, favorites.length);
    
    // Generate cards for current page
    for (let i = startIndex; i < endIndex; i++) {
        const card = createFavoriteCard(favorites[i]);
        favoritesContainer.appendChild(card);
    }
}

/**
 * Create a favorite card element (simplified version)
 * @param {Object} favorite - Favorite tour package object
 * @returns {HTMLElement} Card element
 */
function createFavoriteCard(favorite) {
    const cardCol = document.createElement('div');
    cardCol.className = 'col-6 col-md-6 col-lg-4 favorite-item';
    
    // Generate rating stars HTML
    const ratingValue = parseFloat(favorite.rating) || 4.0;
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;
    
    let starsHTML = '';
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHTML += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        } else {
            starsHTML += '<i class="far fa-star"></i>';
        }
    }
    
    // Format dates and other info if available
    const dates = favorite.dates || 'Flexible';
    const travelers = favorite.travelers || '2-4';
    const organizer = favorite.organizer || 'Tour';
    
    cardCol.innerHTML = `
        <div class="card h-100">
            <div class="position-relative">
                <img src="${favorite.image}" class="card-img-top" alt="${favorite.name}">
                <div class="card-price-overlay">${favorite.price}</div>
                <button class="remove-favorite" data-id="${favorite.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            <div class="card-body d-flex flex-column py-2">
                <h5 class="card-title mb-1"><a href="packages.html">${favorite.name}</a></h5>
                <!-- Date and Users in one row with justify-content-between -->
                <div class="d-flex flex-wrap mb-1 justify-content-between">
                    <span class="card-info-icon"><i class="far fa-calendar"></i>${dates}</span>
                    <span class="card-info-icon"><i class="fas fa-users"></i>${travelers}</span>
                </div>
                <!-- Place in single row -->
                <div class="d-flex flex-wrap mb-1">
                    <span class="card-info-icon"><i class="fas fa-map-marker-alt"></i>${favorite.destination}</span>
                </div>
                <!-- Rating -->
                <div class="d-flex align-items-center mb-2">
                    <div class="rating me-1">
                        ${starsHTML}
                    </div>
                    <span style="font-size: 0.8rem;">${ratingValue.toFixed(1)} (${favorite.reviewCount || '0'})</span>
                </div>
                <a href="packages.html" class="btn btn-primary card-btn-full mt-auto text-center">Book Now</a>
            </div>
        </div>
    `;
    
    // Add event listener to the remove button
    const removeButton = cardCol.querySelector('.remove-favorite');
    removeButton.addEventListener('click', handleRemoveFavorite);
    
    return cardCol;
}

/**
 * Set up event listeners for favorites functionality
 */
function setupEventListeners() {
    // Handle remove from favorites
    const removeButtons = document.querySelectorAll('.remove-favorite');
    removeButtons.forEach(button => {
        button.addEventListener('click', handleRemoveFavorite);
    });
    
    // Handle sorting
    const sortSelect = document.getElementById('sortFavorites');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSortFavorites);
    }
    
    // Add to favorites buttons (on tour package list page)
    const addFavoriteButtons = document.querySelectorAll('.add-favorite');
    addFavoriteButtons.forEach(button => {
        button.addEventListener('click', handleAddFavorite);
    });
    
    // Pagination buttons
    const paginationContainer = document.querySelector('.pagination-container');
    if (paginationContainer) {
        paginationContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('page-link')) {
                e.preventDefault();
                const pageNum = parseInt(e.target.getAttribute('data-page'));
                if (!isNaN(pageNum)) {
                    navigateToPage(pageNum);
                }
            }
        });
    }
}

/**
 * Handle removing a tour package from favorites
 * @param {Event} e - Click event
 */
function handleRemoveFavorite(e) {
    e.preventDefault();
    const favoriteId = this.getAttribute('data-id');
    
    // Get current favorites
    let favorites = getFavorites();
    
    // Remove from favorites array
    favorites = favorites.filter(item => item.id !== favoriteId);
    
    // Save updated favorites
    saveFavorites(favorites);
    
    // Recalculate total pages
    totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);
    
    // Adjust current page if needed
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }
    
    // Remove from DOM with animation
    const card = this.closest('.favorite-item');
    card.style.opacity = '0';
    card.style.transform = 'scale(0.8)';
    card.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
        // Update the UI
        updateFavoritesUI(favorites);
        // Update pagination
        updatePagination();
    }, 300);
    
    // Show toast notification
    showToast('Removed from favorites');
}

/**
 * Handle adding a tour package to favorites
 * @param {Event} e - Click event
 */
function handleAddFavorite(e) {
    e.preventDefault();
    const packageCard = this.closest('.card');
    const packageId = this.getAttribute('data-id');
    
    // Get package details
    const packageName = packageCard.querySelector('.card-title').textContent;
    const packagePrice = packageCard.querySelector('.card-price-overlay').textContent;
    const packageImage = packageCard.querySelector('.card-img-top').src;
    const packageDestination = packageCard.querySelector('.card-info-icon i.fa-map-marker-alt').nextSibling.textContent.trim();
    
    // Create package object
    const packageObj = {
        id: packageId,
        name: packageName,
        price: packagePrice,
        image: packageImage,
        destination: packageDestination,
        dates: packageCard.querySelector('.card-info-icon i.fa-calendar') ? 
               packageCard.querySelector('.card-info-icon i.fa-calendar').nextSibling.textContent.trim() : 'Flexible',
        travelers: packageCard.querySelector('.card-info-icon i.fa-users') ? 
                  packageCard.querySelector('.card-info-icon i.fa-users').nextSibling.textContent.trim() : '2-4',
        rating: '4.5',
        reviewCount: '0'
    };
    
    // Get current favorites
    let favorites = getFavorites();
    
    // Check if already in favorites
    if (favorites.some(item => item.id === packageId)) {
        showToast('Already in favorites');
        return;
    }
    
    // Add to favorites
    favorites.push(packageObj);
    
    // Save updated favorites
    saveFavorites(favorites);
    
    // Recalculate total pages
    totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);
    
    // Show toast notification
    showToast('Added to favorites');
    
    // Update button state
    this.innerHTML = '<i class="fas fa-heart"></i>';
    this.classList.add('active');
}

/**
 * Handle sorting favorites
 * @param {Event} e - Change event
 */
function handleSortFavorites(e) {
    const sortValue = this.value;
    let favorites = getFavorites();
    
    // Sort the items based on the selected option
    favorites.sort((a, b) => {
        const priceA = parseFloat(a.price.replace('$', '').replace(',', ''));
        const priceB = parseFloat(b.price.replace('$', '').replace(',', ''));
        
        if (sortValue === 'price-low') {
            return priceA - priceB;
        } else if (sortValue === 'price-high') {
            return priceB - priceA;
        } else if (sortValue === 'recent') {
            // For now, just keep the current order
            return 0;
        } else {
            // For other sorting options
            return 0;
        }
    });
    
    // Reset to first page
    currentPage = 1;
    
    // Update UI with sorted favorites
    updateFavoritesUI(favorites);
    
    // Update pagination
    updatePagination();
}

/**
 * Navigate to a specific page
 * @param {number} pageNum - Page number to navigate to
 */
function navigateToPage(pageNum) {
    if (pageNum < 1 || pageNum > totalPages) return;
    
    currentPage = pageNum;
    
    // Update UI
    updateFavoritesUI(getFavorites());
    
    // Update pagination
    updatePagination();
    
    // Scroll to top of container
    document.getElementById('favoritesContainer').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Update pagination controls
 */
function updatePagination() {
    const paginationContainer = document.querySelector('.pagination-container');
    if (!paginationContainer) return;
    
    // Hide pagination if only one page
    if (totalPages <= 1) {
        paginationContainer.classList.add('d-none');
        return;
    }
    
    paginationContainer.classList.remove('d-none');
    
    // Generate pagination HTML
    let paginationHTML = `
        <nav aria-label="Favorites pagination">
            <ul class="pagination justify-content-center">
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
    `;
    
    // Determine which page numbers to show
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Adjust start page if needed
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }
    
    // Add next button
    paginationHTML += `
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

/**
 * Show a toast notification
 * @param {string} message - Message to display
 */
function showToast(message) {
    // Check if toast container exists, create if not
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastId = 'toast-' + Date.now();
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    // Initialize and show the toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 2000 });
    toast.show();
    
    // Remove toast after it's hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
    });
}