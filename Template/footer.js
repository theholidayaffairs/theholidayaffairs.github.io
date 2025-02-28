document.addEventListener("DOMContentLoaded", function () {
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = `
            <footer class="footer bg-light text-dark py-4 mt-auto">
                <div class="container">
                    <div class="row text-center text-md-start">
                        <!-- Contact Us -->
                        <div class="col-12 col-md-4 mb-3 mb-md-0">
                            <h5>Contact Us</h5>
                            <p>Kolkata, West Bengal, India</p>
                            <p>Phone: +123 456 7890</p>
                        </div>

                        <!-- Social Media -->
                        <div class="col-12 col-md-4 mb-3 mb-md-0 text-center">
                            <h5>Social</h5>
                            <a href="#" class="me-3"><i class="fab fa-facebook fa-lg"></i></a>
                            <a href="#" class="me-3"><i class="fab fa-instagram fa-lg"></i></a>
                            <a href="#"><i class="fab fa-threads fa-lg"></i></a>
                        </div>

                        <!-- Terms & Policies -->
                        <div class="col-12 col-md-4 text-md-end text-center">
                            <h5>Legal</h5>
                            <p><a href="#">Terms & Conditions</a></p>
                            <p><a href="#">Privacy Policy</a></p>
                            <p><a href="#">Disclaimer</a></p>
                        </div>
                    </div>
                </div>
                
                <!-- Copyright -->
                <div class="text-center py-3 bg-dark text-white">
                    <p class="mb-0">&copy; 2025 The Holiday Affairs - All Rights Reserved.</p>
                </div>
            </footer>

            <!-- FontAwesome for Free Icons -->
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
        `;
  }
});
