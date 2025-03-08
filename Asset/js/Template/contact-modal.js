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
                        <div id="responseMessage" class="text-center d-none">
                          <h5 id="responseText" class="form-label">
                            <i id="responseIcon" class="fa-solid"></i>
                            <span id="responseTextContent"></span>
                          </h5>
                        </div>
                        <form id="contactForm" class="needs-validation" novalidate>
                            <div class="mb-3">
                                <label for="name" class="form-label">Full Name<span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="name" name="name" placeholder="Enter your name" autocomplete="name" required>
                                <div class="invalid-feedback text-white">
                                    Please enter your name.
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="mobile" class="form-label">Mobile Number<span class="text-danger">*</span></label>
                                <input type="tel" class="form-control" id="mobile" name="mobile" placeholder="Enter 10-digit mobile number" pattern="[0-9]{10}" autocomplete="tel" required>
                                <div class="invalid-feedback text-white">
                                    Please enter a valid 10-digit mobile number.
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email ID</label>
                                <input type="email" class="form-control optional-field" id="email" name="email" placeholder="Enter your email" autocomplete="email">
                                <div class="invalid-feedback text-white">
                                    Please enter a valid email address.
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="message" class="form-label">Comment Your Requirement</label>
                                <textarea class="form-control optional-field" id="message" name="message" rows="3" placeholder="Please enter your message within 200 words." maxlength="1200"></textarea>
                                <div class="form-text text-white-50">
                                    <span id="charCount">0</span>/1200 characters
                                </div>
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

  // Character counter for message field
  const messageField = document.getElementById("message");
  const charCount = document.getElementById("charCount");
  
  if (messageField && charCount) {
    messageField.addEventListener("input", function() {
      charCount.textContent = this.value.length;
    });
  }

  // Handle form submission with improved validation
  const form = document.getElementById("contactForm");
  if (form) {
    // Add custom CSS to hide validation icons for empty optional fields
    const style = document.createElement('style');
    style.textContent = `
      .optional-field:placeholder-shown:valid {
        background-image: none !important;
      }
      .optional-field:placeholder-shown + .valid-feedback {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // Custom validation for optional fields
    const optionalFields = form.querySelectorAll('.optional-field');
    optionalFields.forEach(field => {
      // Initial state - remove required attribute
      field.removeAttribute('required');
      
      field.addEventListener('input', function() {
        // If field has content, validate it; otherwise, remove validation
        if (this.value.trim() !== '') {
          this.setAttribute('required', '');
          // Force validation check
          this.classList.remove('is-valid');
          this.classList.remove('is-invalid');
          this.checkValidity();
        } else {
          this.removeAttribute('required');
          this.classList.remove('is-invalid');
          this.classList.remove('is-valid');
        }
      });
      
      // Also check on blur to handle cases where user clicks away
      field.addEventListener('blur', function() {
        if (this.value.trim() === '') {
          this.classList.remove('is-invalid');
          this.classList.remove('is-valid');
        }
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      
      // Reset validation for optional fields before validation
      optionalFields.forEach(field => {
        if (field.value.trim() === '') {
          field.removeAttribute('required');
          field.classList.remove('is-valid');
          field.classList.remove('is-invalid');
        } else {
          field.setAttribute('required', '');
        }
      });
      
      if (!this.checkValidity()) {
        event.stopPropagation();
        this.classList.add("was-validated");
        return;
      }

      const submitButton = this.querySelector("button[type='submit']");
      // Save the original button content
      const originalButtonContent = submitButton.innerHTML;

      // 🚀 Show loader inside the button
      submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...`;
      submitButton.disabled = true;

      let name = document.getElementById("name").value.trim();
      let mobile = document.getElementById("mobile").value.trim();
      let email = document.getElementById("email").value.trim();
      let message = document.getElementById("message").value.trim();

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
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((responseData) => {
          const responseMessage = document.getElementById("responseMessage");
          const responseText = document.getElementById("responseText");
          const responseIcon = document.getElementById("responseIcon");
          const responseTextContent = document.getElementById(
            "responseTextContent"
          );

          if (
            responseData.success === true &&
            responseData.message === "Data sent to Firebase successfully"
          ) {
            emailjs.init(responseData.emailjsPublicKey);

            responseIcon.className =
              "fa-solid fa-circle-check text-success-custom";
            responseTextContent.textContent =
              "Thanks for contacting us! We will get back to you soon.";
            responseText.classList.add("text-success-custom");
            responseText.classList.remove("text-danger");

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
            document.getElementById("contactForm").classList.remove("was-validated");
            if (charCount) charCount.textContent = "0";
          } else {
            responseIcon.className = "fa-solid fa-circle-xmark text-danger";
            responseTextContent.textContent =
              "Something went wrong. Please try again later.";
            responseText.classList.add("text-danger");
            responseText.classList.remove("text-success-custom");
          }
          responseMessage.classList.remove("d-none");
        })
        .catch((error) => {
          const responseMessage = document.getElementById("responseMessage");
          const responseText = document.getElementById("responseText");
          const responseIcon = document.getElementById("responseIcon");
          const responseTextContent = document.getElementById(
            "responseTextContent"
          );

          responseIcon.className = "fa-solid fa-circle-xmark text-danger";
          responseTextContent.textContent =
            "Something went wrong. Please try again later.";
          responseText.classList.add("text-danger");
          responseText.classList.remove("text-success-custom");

          responseMessage.classList.remove("d-none");
          console.error("❌ Error sending data:", error);
        })
        .finally(() => {
          submitButton.innerHTML = originalButtonContent; // ✅ Restore button text
          submitButton.disabled = false; // ✅ Re-enable button
        });
    });
  }

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
    const contactForm = document.getElementById("contactForm");
    const responseMessage = document.getElementById("responseMessage");
    const charCount = document.getElementById("charCount");
    const optionalFields = document.querySelectorAll('.optional-field');

    if (contactForm) {
      contactForm.classList.remove("d-none"); // Show form
      contactForm.classList.remove("was-validated"); // Remove validation styles
      contactForm.reset(); // Clear form fields
      if (charCount) charCount.textContent = "0"; // Reset character counter
      
      // Reset optional fields
      optionalFields.forEach(field => {
        field.removeAttribute('required');
        field.classList.remove('is-invalid');
        field.classList.remove('is-valid');
      });
    }

    if (responseMessage) {
      responseMessage.classList.add("d-none"); // Hide response message
    }
  }

  // Reset form when modal is opened
  const contactModal = document.getElementById("contactModal");
  if (contactModal) {
    contactModal.addEventListener("shown.bs.modal", resetContactForm);
    contactModal.addEventListener("hidden.bs.modal", resetContactForm);
  }
});
