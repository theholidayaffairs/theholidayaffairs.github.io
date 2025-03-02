document.addEventListener("DOMContentLoaded", function () {
    const floatingPlaceholder = document.getElementById("floating-buttons-placeholder");

    if (floatingPlaceholder) {
        floatingPlaceholder.innerHTML = `
            <div class="floating-buttons">
                <!-- WhatsApp Button -->
                <a href="https://wa.me/918910324860?text=Hi!%20I%20am%20interested%20in%20your%20travel%20services."
                    class="whatsapp-float animate-ring" target="_blank">
                    <i class="fab fa-whatsapp"></i>
                </a>

                <!-- Call Button -->
                <a href="tel:+918910324860" class="call-float animate-ring">
                    <i class="fas fa-phone-alt"></i>
                </a>
            </div>
        `;
    }
});
