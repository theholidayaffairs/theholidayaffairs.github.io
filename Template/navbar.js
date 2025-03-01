document.addEventListener("DOMContentLoaded", function () {
  const navbarPlaceholder = document.getElementById("navbar-placeholder");
  if (navbarPlaceholder) {
    navbarPlaceholder.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
                <div class="container">
                    <!-- Logo -->
                    <a class="navbar-brand" href="/">
                        <img src="/Asset/img/tha_logo.png" alt="The Holiday Affairs Logo">
                    </a>

                    <!-- Mobile Menu Button -->
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <!-- Navbar Links (Aligned Right) -->
                    <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul class="navbar-nav">
                            <li class="nav-item"><a class="nav-link nav-close" href="/#aboutus">About Us</a></li>
                            <li class="nav-item"><a class="nav-link nav-close" href="/#services">Services</a></li>

                            <!-- Destinations Dropdown -->
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="destinationsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Destinations
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="destinationsDropdown">
                                    <li><a class="dropdown-item fw-bold" href="./destinations/northeastindia.html">Northeast India</a></li>
                                    <li><a class="dropdown-item ps-4" href="./destinations/northeastindia/shillong.html">Shillong</a></li>
                                    <li><a class="dropdown-item ps-4" href="./destinations/northeastindia/cherrapunji.html">Cherrapunji</a></li>
                                    <li><a class="dropdown-item ps-4" href="./destinations/northeastindia/arunachalpradesh.html">Arunachal Pradesh</a></li>
                                    <li><a class="dropdown-item ps-4" href="./destinations/northeastindia/assam&guwahati.html">Assam & Guwahati</a></li>
                                </ul>
                            </li>

                            <li class="nav-item">
                                <a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#contactModal">Contact Us</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        `;
  }

  // Dropdown Toggle Fix for Mobile
  const dropdownToggle = document.querySelector("#destinationsDropdown");

  if (dropdownToggle) {
    dropdownToggle.addEventListener("click", function (event) {
      if (window.innerWidth < 992) {
        // Only for mobile
        event.preventDefault();
        this.parentElement.classList.toggle("show");
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
      if (
        window.innerWidth < 992 &&
        !dropdownToggle.contains(event.target) &&
        !dropdownToggle.parentElement.contains(event.target)
      ) {
        dropdownToggle.parentElement.classList.remove("show");
      }
    });
  }
});

// Close Navbar on Link Click in Mobile View
const navLinks = document.querySelectorAll(".nav-close");
const navbarCollapse = document.getElementById("navbarNav");

navLinks.forEach(link => {
    link.addEventListener("click", function () {
        if (window.innerWidth < 992) { // Only close on mobile view
            const navbarToggler = document.querySelector(".navbar-toggler");
            if (navbarToggler.getAttribute("aria-expanded") === "true") {
                navbarToggler.click(); // Close the menu
            }
        }
    });
});

// Navbar drop down close in responsive view
document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-close");
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.getElementById("navbarNav");

    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            if (window.innerWidth < 992 && navbarCollapse.classList.contains("show")) { 
                navbarToggler.click(); // Close the menu
            }
        });
    });
});
