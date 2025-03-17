document.addEventListener('DOMContentLoaded', function() {
    // Desktop filter elements
    const filterType = document.getElementById('filterType');
    const citiesFilter = document.getElementById('citiesFilter');
    const budgetFilter = document.getElementById('budgetFilter');
    const durationFilter = document.getElementById('durationFilter');
    const groupFilter = document.getElementById('groupFilter');
    const applyButton = document.querySelector('.btn.btn-primary:not([data-bs-toggle])');
    
    // Mobile filter elements
    const mobileFilterType = document.getElementById('mobileFilterType');
    const mobileFilterOptions = document.getElementById('mobileFilterOptions');
    const mobileApplyButton = document.querySelector('#filterSection .btn.btn-primary');
    const filterSection = document.getElementById('filterSection');
    
    // Add event listener for filter section collapse
    const filterToggleBtn = document.querySelector('[data-bs-target="#filterSection"]');
    if (filterToggleBtn) {
        filterToggleBtn.addEventListener('click', function() {
            const isCollapsed = filterSection.classList.contains('show');
            if (isCollapsed) {
                new bootstrap.Collapse(filterSection).hide();
            } else {
                new bootstrap.Collapse(filterSection).show();
            }
        });
    }
    
    // Hide all desktop filters initially
    function hideAllFilters() {
        citiesFilter.style.cssText = 'display: none !important';
        budgetFilter.style.cssText = 'display: none !important';
        durationFilter.style.cssText = 'display: none !important';
        groupFilter.style.cssText = 'display: none !important';
    }

    // Show selected desktop filter
    filterType.addEventListener('change', function() {
        hideAllFilters();
        
        switch(this.value) {
            case 'cities':
                citiesFilter.style.display = 'block';
                break;
            case 'budget':
                budgetFilter.style.display = 'flex';
                break;
            case 'duration':
                durationFilter.style.display = 'block';
                break;
            case 'group':
                groupFilter.style.display = 'block';
                break;
            default:
                // If no filter is selected, hide all
                hideAllFilters();
                break;
        }
    });
    
    // Mobile filter type change handler
    if (mobileFilterType) {
        mobileFilterType.addEventListener('change', function() {
            // Clear previous options
            mobileFilterOptions.innerHTML = '';
            
            let optionsHTML = '';
            
            switch(this.value) {
                case 'cities':
                    optionsHTML = `
                        <select class="form-select mt-2">
                            <option value="">Any City</option>
                            <option value="maldives">Maldives</option>
                            <option value="switzerland">Switzerland</option>
                            <option value="japan">Japan</option>
                            <option value="uae">UAE</option>
                        </select>
                    `;
                    break;
                case 'budget':
                    optionsHTML = `
                        <div class="d-flex align-items-center gap-2 mt-2">
                            <span class="text-muted">$500</span>
                            <input type="range" class="form-range" style="width: 100%;" min="500" max="5000" step="100" value="2500">
                            <span class="text-muted">$5000</span>
                        </div>
                    `;
                    break;
                case 'duration':
                    optionsHTML = `
                        <select class="form-select mt-2">
                            <option value="">Any Duration</option>
                            <option value="1-3">1-3 Days</option>
                            <option value="4-7">4-7 Days</option>
                            <option value="8-14">8-14 Days</option>
                            <option value="15+">15+ Days</option>
                        </select>
                    `;
                    break;
                case 'group':
                    optionsHTML = `
                        <select class="form-select mt-2">
                            <option value="">Any Size</option>
                            <option value="1-2">1-2 People</option>
                            <option value="3-5">3-5 People</option>
                            <option value="6-10">6-10 People</option>
                            <option value="10+">10+ People</option>
                        </select>
                    `;
                    break;
            }
            
            mobileFilterOptions.innerHTML = optionsHTML;
        });
    }

    // Add desktop filter functionality
    applyButton.addEventListener('click', function() {
        let selectedFilter = filterType.value;
        let filterValue = '';
        
        // Get the selected filter value
        switch(selectedFilter) {
            case 'cities':
                filterValue = citiesFilter.value;
                break;
            case 'budget':
                // For budget, get the range input value
                const budgetInput = budgetFilter.querySelector('input[type="range"]');
                filterValue = budgetInput ? budgetInput.value : '';
                break;
            case 'duration':
                filterValue = durationFilter.value;
                break;
            case 'group':
                filterValue = groupFilter.value;
                break;
        }
        
        // For demo purposes, just alert the selected filter and value
        if(selectedFilter && filterValue) {
            alert(`Filtering by ${selectedFilter}: ${filterValue}`);
            // In a real application, you would filter the tour packages here
        } else if(selectedFilter) {
            alert(`Please select a value for ${selectedFilter} filter`);
        } else {
            alert('Please select a filter type');
        }
    });
    
    // Add mobile filter functionality
    if (mobileApplyButton) {
        mobileApplyButton.addEventListener('click', function() {
            let selectedFilter = mobileFilterType.value;
            let filterValue = '';
            
            // Get the selected filter value
            if (selectedFilter) {
                const filterElement = mobileFilterOptions.querySelector('select, input[type="range"]');
                if (filterElement) {
                    filterValue = filterElement.value;
                }
            }
            
            // For demo purposes, just alert the selected filter and value
            if(selectedFilter && filterValue) {
                alert(`Filtering by ${selectedFilter}: ${filterValue}`);
                // In a real application, you would filter the tour packages here
                
                // Close the filter section after applying
                const bsCollapse = new bootstrap.Collapse(document.getElementById('filterSection'));
                bsCollapse.hide();
            } else if(selectedFilter) {
                alert(`Please select a value for ${selectedFilter} filter`);
            } else {
                alert('Please select a filter type');
            }
        });
    }

    // Initialize by hiding all filters
    hideAllFilters();
});