/**
 * Gallery Modal Functionality
 * This script provides a reusable gallery modal for all destination pages
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if gallery exists on the page
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length === 0) return;
    
    // Create modal if it doesn't exist
    if (!document.getElementById('galleryModal')) {
        createGalleryModal();
    }
    
    // Get modal elements
    const galleryModal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');
    const imageCounter = document.getElementById('imageCounter');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // Collect all gallery images on the page
    const galleryImages = [];
    galleryItems.forEach(item => {
        const imgSrc = item.querySelector('img').getAttribute('src');
        galleryImages.push(imgSrc);
    });
    
    // Current image index
    let currentIndex = 0;
    
    // Update modal image
    function updateModalImage() {
        modalImage.src = galleryImages[currentIndex];
        imageCounter.textContent = `Image ${currentIndex + 1} of ${galleryImages.length}`;
    }
    
    // Event listener for gallery items
    galleryItems.forEach((item, index) => {
        // Set data attribute for index if not already set
        if (!item.hasAttribute('data-img-index')) {
            item.setAttribute('data-img-index', index);
        }
        
        // Set data attributes for modal if not already set
        if (!item.hasAttribute('data-bs-toggle')) {
            item.setAttribute('data-bs-toggle', 'modal');
            item.setAttribute('data-bs-target', '#galleryModal');
        }
        
        // Add click event
        item.addEventListener('click', function() {
            currentIndex = parseInt(this.getAttribute('data-img-index'));
            updateModalImage();
        });
    });
    
    // Previous button click
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            updateModalImage();
        });
    }
    
    // Next button click
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            currentIndex = (currentIndex + 1) % galleryImages.length;
            updateModalImage();
        });
    }
    
    // Keyboard navigation
    if (galleryModal) {
        galleryModal.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            }
        });
        
        // Reset modal when closed
        galleryModal.addEventListener('hidden.bs.modal', function() {
            modalImage.src = '';
        });
    }
    
    // Function to create gallery modal
    function createGalleryModal() {
        const modalHTML = `
        <div class="modal fade gallery-modal" id="galleryModal" tabindex="-1" aria-labelledby="galleryModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="galleryModalLabel">
                            <i class="fas fa-images me-2"></i>Photo Gallery
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <img id="modalImage" src="" alt="Gallery Image" class="gallery-modal-img">
                        <div class="nav-buttons">
                            <button class="nav-btn prev-btn" aria-label="Previous Image">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button class="nav-btn next-btn" aria-label="Next Image">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <span id="imageCounter">Image 1 of 1</span>
                    </div>
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
}); 