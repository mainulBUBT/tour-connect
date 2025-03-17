document.addEventListener('DOMContentLoaded', function() {
    // Initialize all sliders on the page
    initializeSliders();
});

function initializeSliders() {
    const sliders = document.querySelectorAll('.app-slider-container');
    
    sliders.forEach(slider => {
        const slidesContainer = slider.querySelector('.app-slider');
        const slides = slider.querySelectorAll('.app-slider-slide');
        const paginationContainer = slider.querySelector('.app-slider-pagination');
        
        if (!slides.length) return;
        
        let currentIndex = 0;
        let startX;
        let currentX;
        let isDragging = false;
        let autoplayInterval;
        
        // Create pagination dots
        if (paginationContainer) {
            slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('app-slider-dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(index));
                paginationContainer.appendChild(dot);
            });
        }
        
        // Set up touch events
        slidesContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
        slidesContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
        slidesContainer.addEventListener('touchend', handleTouchEnd);
        
        // Mouse events for desktop
        slidesContainer.addEventListener('mousedown', handleMouseDown);
        slidesContainer.addEventListener('mousemove', handleMouseMove);
        slidesContainer.addEventListener('mouseup', handleMouseUp);
        slidesContainer.addEventListener('mouseleave', handleMouseUp);
        
        // Start autoplay
        startAutoplay();
        
        // Stop autoplay on hover/touch
        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);
        slider.addEventListener('touchstart', stopAutoplay, { passive: true });
        slider.addEventListener('touchend', startAutoplay);
        
        function handleTouchStart(e) {
            startX = e.touches[0].clientX;
            isDragging = true;
            stopAutoplay();
        }
        
        function handleTouchMove(e) {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            const slideWidth = slidesContainer.clientWidth;
            const translateX = -currentIndex * slideWidth - diff;
            slidesContainer.style.transform = `translateX(${translateX}px)`;
        }
        
        function handleTouchEnd() {
            if (!isDragging) return;
            isDragging = false;
            const slideWidth = slidesContainer.clientWidth;
            const diff = startX - currentX;
            
            if (Math.abs(diff) > slideWidth / 4) {
                if (diff > 0 && currentIndex < slides.length - 1) {
                    currentIndex++;
                } else if (diff < 0 && currentIndex > 0) {
                    currentIndex--;
                }
            }
            
            goToSlide(currentIndex);
            startAutoplay();
        }
        
        function handleMouseDown(e) {
            startX = e.clientX;
            isDragging = true;
            stopAutoplay();
            slidesContainer.style.cursor = 'grabbing';
        }
        
        function handleMouseMove(e) {
            if (!isDragging) return;
            currentX = e.clientX;
            const diff = startX - currentX;
            const slideWidth = slidesContainer.clientWidth;
            const translateX = -currentIndex * slideWidth - diff;
            slidesContainer.style.transform = `translateX(${translateX}px)`;
        }
        
        function handleMouseUp() {
            if (!isDragging) return;
            isDragging = false;
            slidesContainer.style.cursor = 'grab';
            const slideWidth = slidesContainer.clientWidth;
            const diff = startX - currentX;
            
            if (Math.abs(diff) > slideWidth / 4) {
                if (diff > 0 && currentIndex < slides.length - 1) {
                    currentIndex++;
                } else if (diff < 0 && currentIndex > 0) {
                    currentIndex--;
                }
            }
            
            goToSlide(currentIndex);
            startAutoplay();
        }
        
        function goToSlide(index) {
            currentIndex = index;
            const slideWidth = slidesContainer.clientWidth;
            slidesContainer.style.transform = `translateX(${-index * slideWidth}px)`;
            
            // Update pagination dots
            const dots = paginationContainer.querySelectorAll('.app-slider-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
        
        function startAutoplay() {
            stopAutoplay();
            autoplayInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                goToSlide(currentIndex);
            }, 5000);
        }
        
        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            goToSlide(currentIndex);
        });
    });
}