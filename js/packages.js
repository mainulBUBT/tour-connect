/**
 * Packages page JavaScript
 * Handles tab functionality and reviews pagination
 */

document.addEventListener('DOMContentLoaded', function() {
    // Reviews pagination variables
    let currentPage = 1;
    let reviewsPerPage = 3;
    let totalReviews = 0;
    let totalPages = 0;
    
    // Sample reviews data - in a real application, this would come from a database
    const reviewsData = [
        {
            name: "Sarah J.",
            rating: 5,
            comment: "Absolutely amazing experience! The overwater villa was stunning and staff was incredibly attentive.",
            date: "October 2023"
        },
        {
            name: "Michael T.",
            rating: 5,
            comment: "The tour guides were knowledgeable and friendly. The snorkeling experience was unforgettable!",
            date: "September 2023"
        },
        {
            name: "Jessica L.",
            rating: 4,
            comment: "Beautiful location and excellent service. The food options could have been more diverse.",
            date: "August 2023"
        },
        {
            name: "David R.",
            rating: 5,
            comment: "One of the best vacations I've ever had. The villa was luxurious and the views were breathtaking.",
            date: "July 2023"
        },
        {
            name: "Emma W.",
            rating: 4,
            comment: "Great experience overall. The snorkeling was amazing but the food was just okay.",
            date: "July 2023"
        },
        {
            name: "Robert K.",
            rating: 5,
            comment: "Exceptional service from start to finish. The staff went above and beyond to make our stay memorable.",
            date: "June 2023"
        },
        {
            name: "Lisa M.",
            rating: 5,
            comment: "The tour was perfectly organized. Every detail was taken care of and we didn't have to worry about anything.",
            date: "May 2023"
        },
        {
            name: "John D.",
            rating: 4,
            comment: "Great resort and activities. The only downside was the weather, but that's not their fault.",
            date: "April 2023"
        }
    ];
    
    // Initialize reviews
    initReviews();
    
    // Tab click event listeners
    const reviewsTab = document.getElementById('reviews-tab');
    if (reviewsTab) {
        reviewsTab.addEventListener('click', function() {
            // Refresh reviews pagination when tab is clicked
            renderReviews();
            updatePagination();
        });
    }
    
    /**
     * Initialize reviews section
     */
    function initReviews() {
        totalReviews = reviewsData.length;
        totalPages = Math.ceil(totalReviews / reviewsPerPage);
        
        // Create pagination container if it doesn't exist
        const reviewsContainer = document.querySelector('#reviews .app-card');
        if (reviewsContainer) {
            // Remove the "View All Reviews" button as we'll replace it with pagination
            const viewAllBtn = reviewsContainer.querySelector('button.btn-outline-primary');
            if (viewAllBtn) {
                viewAllBtn.remove();
            }
            
            // Add pagination container
            if (!document.querySelector('.reviews-pagination-container')) {
                const paginationContainer = document.createElement('div');
                paginationContainer.className = 'reviews-pagination-container mt-4 mb-3';
                reviewsContainer.appendChild(paginationContainer);
                
                // Add event listener for pagination clicks
                paginationContainer.addEventListener('click', function(e) {
                    if (e.target.tagName === 'A' || e.target.parentElement.tagName === 'A') {
                        e.preventDefault();
                        
                        const pageLink = e.target.closest('a');
                        if (pageLink && pageLink.dataset.page) {
                            const newPage = parseInt(pageLink.dataset.page);
                            if (newPage !== currentPage && newPage >= 1 && newPage <= totalPages) {
                                currentPage = newPage;
                                renderReviews();
                                updatePagination();
                            }
                        }
                    }
                });
            }
            
            // Initial render
            renderReviews();
            updatePagination();
        }
    }
    
    /**
     * Render reviews for current page
     */
    function renderReviews() {
        const reviewsContainer = document.querySelector('#reviews .app-card');
        if (!reviewsContainer) return;
        
        // Remove existing review items except the summary
        const existingReviews = reviewsContainer.querySelectorAll('.review-item');
        existingReviews.forEach(item => item.remove());
        
        // Calculate start and end index for current page
        const startIndex = (currentPage - 1) * reviewsPerPage;
        const endIndex = Math.min(startIndex + reviewsPerPage, totalReviews);
        
        // Get pagination container or create it if it doesn't exist
        let paginationContainer = reviewsContainer.querySelector('.reviews-pagination-container');
        if (!paginationContainer) {
            paginationContainer = document.createElement('div');
            paginationContainer.className = 'reviews-pagination-container mt-4 mb-3';
            reviewsContainer.appendChild(paginationContainer);
        }
        
        // Generate review items for current page
        for (let i = startIndex; i < endIndex; i++) {
            const review = reviewsData[i];
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item p-3 bg-light rounded-3 mb-2';
            
            // Generate stars based on rating
            let starsHTML = '';
            for (let j = 1; j <= 5; j++) {
                if (j <= review.rating) {
                    starsHTML += '<i class="fas fa-star"></i>';
                } else {
                    starsHTML += '<i class="far fa-star"></i>';
                }
            }
            
            reviewItem.innerHTML = `
                <div class="d-flex justify-content-between mb-1">
                    <span class="fw-bold">${review.name}</span>
                    <div class="text-warning">
                        ${starsHTML}
                    </div>
                </div>
                <p class="mb-1 small">${review.comment}</p>
                <span class="text-muted smaller">Traveled: ${review.date}</span>
            `;
            
            // Insert before pagination container
            reviewsContainer.insertBefore(reviewItem, paginationContainer);
        }
    }
    
    /**
     * Update pagination controls
     */
    function updatePagination() {
        const paginationContainer = document.querySelector('.reviews-pagination-container');
        if (!paginationContainer) return;
        
        // Hide pagination if only one page
        if (totalPages <= 1) {
            paginationContainer.classList.add('d-none');
            return;
        }
        
        paginationContainer.classList.remove('d-none');
        
        // Generate pagination HTML
        let paginationHTML = `
            <nav aria-label="Reviews pagination">
                <ul class="pagination justify-content-center">
                    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                        <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
                            <i class="fas fa-chevron-left"></i>
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
                            <i class="fas fa-chevron-right"></i>
                        </a>
                    </li>
                </ul>
            </nav>
        `;
        
        paginationContainer.innerHTML = paginationHTML;
    }
});