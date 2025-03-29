/**
 * Search functionality for TourConnect
 * Handles search operations, filter management, and recent searches storage
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    const filterChips = document.querySelectorAll('.filter-chip');
    const recentSearchesContainer = document.getElementById('recentSearches');
    const searchResults = document.getElementById('searchResults');
    const noResults = document.getElementById('noResults');
    const recentSearchRemoveBtns = document.querySelectorAll('.recent-search-remove');
    
    // Load trending searches
    loadTrendingSearches();
    
    // Show trending searches when search input is focused
    searchInput.addEventListener('focus', function() {
        if (recentSearchesContainer) {
            recentSearchesContainer.style.display = 'block';
        }
    });
    
    // Hide trending searches when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !recentSearchesContainer.contains(e.target)) {
            recentSearchesContainer.style.display = 'none';
        }
    });
    
    // Show/hide clear button based on input
    searchInput.addEventListener('input', function() {
        searchClear.style.display = this.value ? 'block' : 'none';
        
        // If user types and presses enter, perform search
        if (event.key === 'Enter' && this.value.trim() !== '') {
            performSearch(this.value.trim());
        }
    });
    
    // Clear search input
    searchClear.addEventListener('click', function() {
        searchInput.value = '';
        searchClear.style.display = 'none';
        searchInput.focus();
    });
    
    // Filter chip selection
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            filterChips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // If there's a search term, filter results based on selected category
            if (searchInput.value.trim() !== '') {
                performSearch(searchInput.value.trim());
            }
        });
    });
    
    // Remove recent search items
    recentSearchRemoveBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const searchItem = this.closest('.recent-search-item');
            const searchText = searchItem.querySelector('.recent-search-text').textContent;
            
            // Remove from DOM
            searchItem.remove();
            
            // Remove from localStorage
            removeFromRecentSearches(searchText);
        });
    });
    
    // Add click event to recent search items
    document.querySelectorAll('.recent-search-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (!e.target.classList.contains('recent-search-remove') && 
                !e.target.closest('.recent-search-remove')) {
                const searchText = this.querySelector('.recent-search-text').textContent;
                searchInput.value = searchText;
                searchClear.style.display = 'block';
                performSearch(searchText);
            }
        });
    });
    
    // Add to favorites functionality
    const favButtons = document.querySelectorAll('.add-favorite');
    favButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        });
    });
    
    /**
     * Perform search and update results
     * @param {string} query - The search query
     */
    function performSearch(query) {
        // Add to recent searches
        addToRecentSearches(query);
        
        // Get active filter
        const activeFilter = document.querySelector('.filter-chip.active').textContent;
        
        // In a real app, this would make an API call to get filtered results
        // For demo purposes, we'll just show/hide the results container
        if (query.trim() === '') {
            searchResults.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }
        
        // Show search results (in a real app, this would update with actual filtered results)
        searchResults.style.display = 'block';
        noResults.style.display = 'none';
        
        // Update result count (this would be dynamic in a real app)
        document.querySelector('.search-result-count').textContent = '24 results found';
    }
    
    /**
     * Add a search term to recent searches
     * @param {string} term - The search term to add
     */
    function addToRecentSearches(term) {
        // Get existing searches from localStorage
        let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        
        // Remove if already exists (to move it to the top)
        recentSearches = recentSearches.filter(search => search !== term);
        
        // Add to beginning of array
        recentSearches.unshift(term);
        
        // Keep only the most recent 5 searches
        recentSearches = recentSearches.slice(0, 5);
        
        // Save back to localStorage
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
        
        // Update the UI
        updateRecentSearchesUI(recentSearches);
    }
    
    /**
     * Remove a search term from recent searches
     * @param {string} term - The search term to remove
     */
    function removeFromRecentSearches(term) {
        // Get existing searches from localStorage
        let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        
        // Remove the term
        recentSearches = recentSearches.filter(search => search !== term);
        
        // Save back to localStorage
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
    
    /**
     * Load trending searches and update UI
     */
    function loadTrendingSearches() {
        // In a real app, these would come from an API or backend
        // For demo purposes, we'll use hardcoded trending searches
        const trendingSearches = [
            "Beach tours in Bali",
            "Mountain hiking",
            "Food tours in Italy"
        ];
        updateTrendingSearchesUI(trendingSearches);
    }
    
    /**
     * Update the trending searches UI
     * @param {Array} searches - Array of trending search terms
     */
    function updateTrendingSearchesUI(searches) {
        // Clear existing items except the heading
        const heading = recentSearchesContainer.querySelector('h6');
        recentSearchesContainer.innerHTML = '';
        recentSearchesContainer.appendChild(heading);
        
        // If no trending searches, hide the container
        if (searches.length === 0) {
            recentSearchesContainer.style.display = 'none';
            return;
        }
        
        // Initially hide the container - will show on focus
        recentSearchesContainer.style.display = 'none';
        
        // Add each search term
        searches.forEach(term => {
            const searchItem = document.createElement('div');
            searchItem.className = 'recent-search-item';
            searchItem.innerHTML = `
                <i class="fas fa-fire recent-search-icon"></i>
                <span class="recent-search-text">${term}</span>
                <button class="recent-search-remove">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Add click event to the item
            searchItem.addEventListener('click', function(e) {
                if (!e.target.classList.contains('recent-search-remove') && 
                    !e.target.closest('.recent-search-remove')) {
                    searchInput.value = term;
                    searchClear.style.display = 'block';
                    performSearch(term);
                }
            });
            
            // Add click event to the remove button
            searchItem.querySelector('.recent-search-remove').addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                searchItem.remove();
                removeFromRecentSearches(term);
            });
            
            recentSearchesContainer.appendChild(searchItem);
        });
    }
});