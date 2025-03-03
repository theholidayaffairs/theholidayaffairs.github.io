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
                        <div id="errorMessage" class="text-center text-danger d-none">
                            <h5 class="form-label">❌ Something went wrong. Please try again later.</h5>
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
  document
    .getElementById("contactForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      let name = document.getElementById("name").value.trim();
      let mobile = document.getElementById("mobile").value.trim();
      let email = document.getElementById("email").value.trim();
      let message = document.getElementById("message").value.trim();

      if (!name || !mobile) {
        alert("⚠️ Full Name and Mobile Number are required.");
        return;
      }

      // Data to send
      let formData = {
        name: name,
        mobile: mobile,
        email: email,
        message: message,
      };

      // Send data to Cloudflare Worker
      fetch("https://tha-contact-form.theholidayaffairs.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((responseData) => {
          // If the response indicates success
          if (responseData.message === "Data sent to Firebase successfully") {
            // Initialize EmailJS with the public key from the Cloudflare response
            emailjs.init(responseData.emailjsPublicKey); // Initialize with the public key from the response

            document
              .getElementById("successMessage")
              .classList.remove("d-none");
            document.getElementById("errorMessage").classList.add("d-none");

            // If email sending is enabled, send email
            if (responseData.emailEnabled) {
              sendEmail(
                name,
                mobile,
                email,
                message,
                responseData.emailServiceId,
                responseData.emailTemplateId
              );
            }

            document.getElementById("contactForm").reset();
            document.getElementById("contactForm").classList.add("d-none");
          } else {
            throw new Error(
              "Error from Cloudflare Worker: " + responseData.message
            );
          }
        })
        .catch((error) => {
          console.error("❌ Error sending data:", error);
          let errorMsg = document.getElementById("errorMessage");
          if (errorMsg) errorMsg.classList.remove("d-none");

          document.getElementById("successMessage").classList.add("d-none");
        });
    });

  // Function to send email dynamically using values from response
  function sendEmail(
    name,
    mobile,
    email,
    message,
    emailServiceId,
    emailTemplateId
  ) {
    emailjs
      .send(emailServiceId, emailTemplateId, {
        name: name,
        mobile: mobile,
        email: email,
        message: message,
        date: new Date().toLocaleString(),
      })
      .then(() => {
        console.log("📧 Email sent successfully!");
      })
      .catch((error) => {
        console.error("❌ Email sending failed:", error);
      });
  }

  // Function to reset form and messages
  function resetContactForm() {
    document.getElementById("contactForm").classList.remove("d-none"); // Show form
    document.getElementById("contactForm").reset(); // Clear form fields
    document.getElementById("successMessage").classList.add("d-none"); // Hide success message
    document.getElementById("errorMessage").classList.add("d-none"); // Hide error message
  }

  // Reset form when modal is opened
  document
    .getElementById("contactModal")
    .addEventListener("shown.bs.modal", resetContactForm);

  // Reset form when modal is closed
  document
    .getElementById("contactModal")
    .addEventListener("hidden.bs.modal", resetContactForm);
});
