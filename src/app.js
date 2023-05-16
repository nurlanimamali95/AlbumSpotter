function searchArtist() {
  const artistName = document.getElementById("artistName").value;
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
      fetch(
        `https://api.spotify.com/v1/search?q=artist:${artistName}&type=album`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          // Display the artist's albums in the UI
          const albums = data.albums.items;
          console.log(albums);
          const albumList = document.getElementById("albumList");
          albumList.innerHTML = "";
          albums.forEach((album) => {
            const albumItem = document.createElement("li");
            albumItem.classList.add("albumClass");
            // Create a div for the tracklist inside the album item
            const trackListContainer = document.createElement("div");
            trackListContainer.classList.add("trackListContainer");
            trackListContainer.style.overflow = "auto";

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
                  console.log(trackList);
                  const trackListElement = document.createElement("ul"); // Create a new UL element for the tracklist
                  trackListElement.classList.add("trackList");
                  trackList.forEach((track) => {
                    const trackItem = document.createElement("li");
                    trackItem.classList.add("trackClass");
                    trackItem.innerHTML = `
                      <iframe src="https://open.spotify.com/embed/track/${track.id}"
                        width="300"
                        height="80"
                        frameborder="0"
                        allowtransparency="true"
                        allow="encrypted-media"></iframe>
                    `;
                    trackListElement.appendChild(trackItem);
                  });
                  // Append the tracklist to the container inside the album item
                  trackListContainer.appendChild(trackListElement);
                })
                .catch((error) => console.error(error));
            });
            albumList.appendChild(albumItem);
          });
        });
    });
}
