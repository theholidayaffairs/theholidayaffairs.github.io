// Carousel Text Animation
document.addEventListener("DOMContentLoaded", function () {
  let typingElements = document.querySelectorAll(".typing-text");
  let typingTimers = new Map(); // Store typing timers for each element

  function typeEffect(element) {
    let text = element.getAttribute("data-text");
    element.textContent = ""; // Clear previous text
    let i = 0;

    // Clear any existing timer before starting a new one
    if (typingTimers.has(element)) {
      clearTimeout(typingTimers.get(element));
    }

    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        let timer = setTimeout(type, 100);
        typingTimers.set(element, timer);
      }
    }

    type();
  }

  function resetTypingEffect() {
    typingElements.forEach((el) => {
      el.textContent = ""; // Clear all captions
      el.dataset.typing = "false"; // Prevent overlap
      if (typingTimers.has(el)) {
        clearTimeout(typingTimers.get(el)); // Stop any running typing effect
      }
    });
  }

  // Initial typing effect for the first slide
  let activeCaption = document.querySelector(
    ".carousel-item.active .typing-text"
  );
  if (activeCaption) {
    typeEffect(activeCaption);
    activeCaption.dataset.typing = "true"; // Mark as active
  }

  // Ensure #homeCarousel exists before adding event listeners
  let homeCarousel = document.querySelector("#homeCarousel");
  if (homeCarousel) {
    homeCarousel.addEventListener("slide.bs.carousel", function () {
      resetTypingEffect(); // Clear text before the next slide appears
    });

    homeCarousel.addEventListener("slid.bs.carousel", function () {
      let newActiveCaption = document.querySelector(
        ".carousel-item.active .typing-text"
      );
      if (newActiveCaption && newActiveCaption.dataset.typing !== "true") {
        newActiveCaption.dataset.typing = "true"; // Mark as active
        typeEffect(newActiveCaption);
      }
    });
  }
});

// ---------------------------
// Typing Animation
document.addEventListener("DOMContentLoaded", function () {
  let typingElement = document.getElementById("typing");
  if (!typingElement) return; // Prevents error if element doesn't exist
  let text = typingElement.innerText.trim(); // Get the existing text inside <h2>
  let index = 0;
  let isDeleting = false;
  let speed = 100; // Typing speed
  let deleteSpeed = 50; // Speed for deleting characters
  let pauseTime = 1500; // Pause time before deleting and retyping

  function typeText() {
    if (!isDeleting && index <= text.length) {
      typingElement.innerText = text.substring(0, index);
      index++;
      setTimeout(typeText, speed);
    } else if (!isDeleting && index > text.length) {
      isDeleting = true;
      setTimeout(typeText, pauseTime);
    } else if (isDeleting && index >= 0) {
      typingElement.innerText = text.substring(0, index);
      index--;
      setTimeout(typeText, deleteSpeed);
    } else {
      isDeleting = false;
      setTimeout(typeText, speed);
    }
  }

  // Start animation
  typingElement.innerText = ""; // Clear text before animation starts
  typeText();
});

// ---------------------------
// JavaScript for Tab Switching
document.addEventListener("DOMContentLoaded", function () {
  const aboutTab = document.getElementById("about-tab");
  const itineraryTab = document.getElementById("itinerary-tab");
  const aboutSection = document.getElementById("about-section");
  const itinerarySection = document.getElementById("itinerary-section");

  if (!aboutTab || !itineraryTab || !aboutSection || !itinerarySection) return; // Prevents error if elements don't exist

  aboutTab.addEventListener("click", function (event) {
    event.preventDefault(); // Prevents redirection
    aboutSection.style.display = "block";
    itinerarySection.style.display = "none";
    aboutTab.classList.add("active");
    itineraryTab.classList.remove("active");
  });

  itineraryTab.addEventListener("click", function (event) {
    event.preventDefault(); // Prevents redirection
    aboutSection.style.display = "none";
    itinerarySection.style.display = "block";
    itineraryTab.classList.add("active");
    aboutTab.classList.remove("active");
  });
});

// ---------------------------
// JavaScript for Image Loader
document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll(".gallery-img");

  images.forEach((img) => {
    img.onload = function () {
      this.style.display = "block"; // Show image when loaded
      let loader = this.closest(".gallery-item")?.querySelector(".loader");
      if (loader) {
        loader.style.display = "none"; // Hide loader
      }
    };
  });
});

// ---------------------------
