// Carousel Text Animation
function typeEffect(element, speed) {
  let fullText = element.getAttribute("data-text");
  let index = 0;
  element.innerHTML = "";
  function type() {
    if (index < fullText.length) {
      element.innerHTML += fullText.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  }
  type();
}

document.addEventListener("DOMContentLoaded", function () {
  let carousel = document.getElementById("homeCarousel");
  let texts = document.querySelectorAll(".typing-text");

  texts.forEach((text) => typeEffect(text, 100));
  carousel.addEventListener("slid.bs.carousel", function () {
    texts.forEach((text) => typeEffect(text, 100));
  });
});

// ---------------------------
