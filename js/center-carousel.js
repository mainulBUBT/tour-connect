document.addEventListener('DOMContentLoaded', function() {
    initializeCenterCarousel();
});

function initializeCenterCarousel() {
    const carousel = document.querySelector('.center-carousel');
    if (!carousel) return;
    
    const track = carousel.querySelector('.center-carousel-track');
    const slides = carousel.querySelectorAll('.center-carousel-slide');
    const indicators = document.querySelectorAll('.center-carousel-indicator');
    const prevButton = document.querySelector('.center-carousel-control.prev');
    const nextButton = document.querySelector('.center-carousel-control.next');
    
    if (!slides.length) return;
    
    let currentIndex = 0;
    let startX;
    let currentX;
    let isDragging = false;
    let autoplayInterval;
    
    // Set initial state
    updateCarousel();
    
    // Event listeners for controls
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });
    }
    
    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });
    
    // Touch events
    track.addEventListener('touchstart', handleTouchStart, { passive: true });
    track.addEventListener('touchmove', handleTouchMove, { passive: true });
    track.addEventListener('touchend', handleTouchEnd);
    
    // Mouse events
    track.addEventListener('mousedown', handleMouseDown);
    track.addEventListener('mousemove', handleMouseMove);
    track.addEventListener('mouseup', handleMouseUp);
    track.addEventListener('mouseleave', handleMouseUp);
    
    // Start autoplay
    startAutoplay();
    
    // Functions
    function updateCarousel() {
        // Calculate the transform value to center the current slide
        const slideWidth = slides[0].offsetWidth;
        const trackWidth = track.offsetWidth;
        const offset = (trackWidth - slideWidth) / 2;
        const translateX = -currentIndex * slideWidth + offset;
        
        // Apply transform to the track
        track.style.transform = `translateX(${translateX}px)`;
        
        // Update active class on slides
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentIndex);
        });
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }
    
    function handleTouchStart(e) {
        stopAutoplay();
        startX = e.touches[0].clientX;
        isDragging = true;
    }
    
    function handleTouchMove(e) {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        const slideWidth = slides[0].offsetWidth;
        const trackWidth = track.offsetWidth;
        const offset = (trackWidth - slideWidth) / 2;
        const translateX = -currentIndex * slideWidth + offset - diff;
        
        track.style.transform = `translateX(${translateX}px)`;
    }
    
    function handleTouchEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        const diff = startX - currentX;
        const slideWidth = slides[0].offsetWidth;
        
        if (Math.abs(diff) > slideWidth / 3) {
            if (diff > 0) {
                // Swipe left, go to next slide
                currentIndex = Math.min(currentIndex + 1, slides.length - 1);
            } else {
                // Swipe right, go to previous slide
                currentIndex = Math.max(currentIndex - 1, 0);
            }
        }
        
        updateCarousel();
        startAutoplay();
    }
    
    function handleMouseDown(e) {
        e.preventDefault();
        stopAutoplay();
        startX = e.clientX;
        isDragging = true;
        track.style.cursor = 'grabbing';
    }
    
    function handleMouseMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.clientX;
        const diff = startX - currentX;
        const slideWidth = slides[0].offsetWidth;
        const trackWidth = track.offsetWidth;
        const offset = (trackWidth - slideWidth) / 2;
        const translateX = -currentIndex * slideWidth + offset - diff;
        
        track.style.transform = `translateX(${translateX}px)`;
    }
    
    function handleMouseUp(e) {
        if (!isDragging) return;
        e.preventDefault();
        isDragging = false;
        track.style.cursor = 'grab';
        
        const diff = startX - currentX;
        const slideWidth = slides[0].offsetWidth;
        
        if (Math.abs(diff) > slideWidth / 3) {
            if (diff > 0) {
                // Swipe left, go to next slide
                currentIndex = Math.min(currentIndex + 1, slides.length - 1);
            } else {
                // Swipe right, go to previous slide
                currentIndex = Math.max(currentIndex - 1, 0);
            }
        }
        
        updateCarousel();
        startAutoplay();
    }
    
    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        }, 5000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Handle window resize
    window.addEventListener('resize', updateCarousel);
}