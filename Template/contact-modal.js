document.addEventListener("DOMContentLoaded", function () {
    const modalHTML = `
    <div class="modal fade" id="contactModal" tabindex="-1" aria-labelledby="contactModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content custom-blur">
                <div class="modal-header">
                    <h5 class="modal-title text-white" id="contactModalLabel">Contact Us</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-white">
                    <div id="successMessage" class="text-center d-none">
                        <h5 class="form-label">✅ Thanks for contacting us! We will get back to you soon.</h5>
                    </div>
                    <form id="contactForm">
                        <div class="mb-3">
                            <label for="name" class="form-label">Full Name<span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="name" name="name" placeholder="Enter your name" required>
                        </div>
                        <div class="mb-3">
                            <label for="mobile" class="form-label">Mobile Number<span class="text-danger">*</span></label>
                            <input type="tel" class="form-control" id="mobile" name="mobile" placeholder="Enter 10-digit mobile number" pattern="[0-9]{10}" required>
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email ID</label>
                            <input type="email" class="form-control" id="email" name="email" placeholder="Enter your email">
                        </div>
                        <div class="mb-3">
                            <label for="message" class="form-label">Comment Your Requirement</label>
                            <textarea class="form-control" id="message" name="message" rows="3" placeholder="Enter your message"></textarea>
                        </div>
                        <div class="d-flex justify-content-center">
                            <button type="submit" class="btn btn-custom">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>`;

    // Append modal to body
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Handle form submission
    const contactForm = document.getElementById("contactForm");
    const successMessage = document.getElementById("successMessage");

    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(contactForm);

        try {
            const response = await fetch("https://formspree.io/f/movjgwdk", {
                method: "POST",
                body: formData,
                headers: { "Accept": "application/json" }
            });

            if (response.ok) {
                contactForm.classList.add("d-none"); // Hide form
                successMessage.classList.remove("d-none"); // Show success message
            } else {
                alert("⚠️ Oops! Something went wrong. Please try again.");
            }
        } catch (error) {
            alert("❌ Error submitting form. Please check your internet connection.");
        }
    });
});
