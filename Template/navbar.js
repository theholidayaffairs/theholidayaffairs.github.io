document.addEventListener("DOMContentLoaded", function () {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");
    if (navbarPlaceholder) {
        navbarPlaceholder.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
                <div class="container">
                    <!-- Logo -->
                    <a class="navbar-brand" href="#">
                        <img src="Asset/img/tha_logo.png" alt="The Holiday Affairs Logo">
                    </a>

                    <!-- Mobile Menu Button -->
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <!-- Navbar Links (Aligned Right) -->
                    <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul class="navbar-nav">
                            <li class="nav-item"><a class="nav-link" href="#aboutus">About Us</a></li>
                            <li class="nav-item"><a class="nav-link" href="#services">Services</a></li>

                            <!-- Destinations Dropdown -->
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="destinationsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Destinations
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="destinationsDropdown">
                                    <li><a class="dropdown-item" href="#">North East</a></li>
                                    <li><a class="dropdown-item" href="#">Shillong</a></li>
                                    <li><a class="dropdown-item" href="#">Cherrapunji</a></li>
                                    <li><a class="dropdown-item" href="#">Arunachal Pradesh</a></li>
                                    <li><a class="dropdown-item" href="#">Assam & Guwahati</a></li>
                                </ul>
                            </li>

                            <li class="nav-item"><a class="nav-link" href="#">Contact Us</a></li>
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
            if (window.innerWidth < 992) { // Only for mobile
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
