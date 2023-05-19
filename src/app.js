function searchArtist() {
  const query = document.getElementById("artistName").value;
  const errorMessage = document.getElementById("errorMessage");

  if (query === "") {
    errorMessage.style.display = "block";
    return;
  }

  errorMessage.style.display = "none";

  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        btoa(
          "795d2a19151a4e14904f6c4479debf47" +
            ":" +
            "fe64ff9addf14d88b9a3c287f97fca33"
        ),
    },
    body: "grant_type=client_credentials",
  })
    .then((response) => response.json())
    .then((data) => {
      const accessToken = data.access_token;
      fetch(`https://api.spotify.com/v1/search?q=${query}&type=album`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Display the artist's albums in the UI
          const albums = data.albums.items;
          const albumList = document.getElementById("albumList");
          albumList.innerHTML = "";
          albums.forEach((album) => {
            const albumItem = document.createElement("li");
            albumItem.classList.add("albums");
            // Create a div for the tracklist inside the album item
            const trackListContainer = document.createElement("div");
            trackListContainer.classList.add("trackListContainer");

            albumItem.innerHTML = `
              <img class="albumImage" src="${album.images[0].url}" alt="${album.name} cover">
              <div class="albumName">
                <h3 class="albumTitle">${album.name}</h3>
                <p>${album.artists[0].name}</p>
              </div>
            `;

            albumItem.appendChild(trackListContainer); // Append the tracklist container to the album item

            albumItem.addEventListener("click", () => {
              // Fetch the list of tracks for the selected album
              fetch(`https://api.spotify.com/v1/albums/${album.id}/tracks`, {
                method: "GET",
                headers: {
                  Authorization: "Bearer " + accessToken,
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  const trackList = data.items;
                  const trackListElement = document.createElement("ul"); // Create a new UL element for the tracklist
                  trackListElement.classList.add("trackList");
                  trackList.forEach((track) => {
                    const trackItem = document.createElement("li");
                    trackItem.classList.add("trackClass");
                    trackItem.innerHTML = `
                      <iframe src="https://open.spotify.com/embed/track/${track.id}"
                        width="600"
                        height="80"
                        frameborder="0"
                        allowtransparency="true"
                        allow="encrypted-media"></iframe>
                    `;
                    trackListElement.appendChild(trackItem);
                  });
                  // Display the overlay and add the tracklist to the "trackListContainer" div
                  const overlay = document.getElementById("overlay");
                  overlay.style.display = "block";
                  const trackListContainer =
                    document.getElementById("trackListContainer");
                  trackListContainer.innerHTML = "";
                  trackListContainer.appendChild(trackListElement);

                  // Create close button
                  const closeButton = document.createElement("button");
                  closeButton.innerText = "BACK";
                  closeButton.classList.add("closeButton");

                  // Add click event listener to close button
                  closeButton.addEventListener("click", () => {
                    // Stop the currently playing track, if any
                    const iframe = trackListElement.querySelector("iframe");

                    // Hide the overlay
                    overlay.style.display = "none";
                    closeButton.remove();
                  });

                  // Append close button to overlay
                  overlay.appendChild(closeButton);
                })
                .catch((error) => console.error(error));
            });
            albumList.appendChild(albumItem);
          });
        });
    })
    .catch((error) => console.error(error));
}
