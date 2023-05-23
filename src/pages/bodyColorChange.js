let body = document.querySelector("body");

window.addEventListener("scroll", function () {
  // Check if the user has scrolled to a certain position on the page within mobile device
  if (window.pageYOffset > 200) {
    body.classList.add("scroll-effect");
  } else {
    // Remove the scroll-effect class from the body element
    body.classList.remove("scroll-effect");
  }
});

let backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", function () {
  if (window.pageYOffset > 200) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});
