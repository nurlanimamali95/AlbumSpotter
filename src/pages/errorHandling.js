export function displayErrorMessage(message) {
  const errorMessage = document.getElementById("errorMessage");
  errorMessage.innerText = message;
  errorMessage.style.display = "block";
}

export function internetFailed(albumItem) {
  if (!navigator.onLine) {
  }
  albumItem.addEventListener("click", () => {
    if (!navigator.onLine) {
      albumList.innerHTML = "";
      displayErrorMessage("Please check your internet connection.");
      return;
    }
  });
}
