export function createOverlay(trackListElement) {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "block";
  const trackListContainer = document.getElementById("trackListContainer");
  trackListContainer.innerHTML = "";
  trackListContainer.appendChild(trackListElement);

  const closeButton = document.createElement("button");
  closeButton.innerText = "BACK";
  closeButton.classList.add("closeButton");

  closeButton.addEventListener("click", () => {
    overlay.style.display = "none";
    closeButton.remove();
    trackListContainer.innerHTML = "";
  });

  overlay.appendChild(closeButton);
}
