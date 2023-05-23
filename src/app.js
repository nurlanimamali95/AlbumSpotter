import {
  fetchAccessToken,
  searchAlbums,
  fetchAlbumTracks,
} from "../src/API/api.js";

import { createOverlay } from "../src/pages/overlay.js";

const searchArtist = () => {
  const query = document.getElementById("artistName").value;
  const errorMessage = document.getElementById("errorMessage");
  const albumList = document.getElementById("albumList");
  let accessToken;

  // to clear previous search
  albumList.innerHTML = "";
  errorMessage.style.display = "none";

  if (query === "") {
    albumList.innerHTML = "";
    errorMessage.style.display = "block";
    return;
  }

  errorMessage.style.display = "none";

  fetchAccessToken()
    .then((token) => {
      accessToken = token;
      return searchAlbums(query, accessToken);
    })
    .then((albums) => {
      albums.forEach((album) => {
        const albumItem = document.createElement("li");
        albumItem.classList.add("albums");
        const trackListContainer = document.createElement("div");
        trackListContainer.classList.add("trackListContainer");

        albumItem.innerHTML = `
          <img class="albumImage" src="${album.images[0].url}" alt="${album.name} cover">
          <div class="albumName">
            <h3 class="albumTitle">${album.name}</h3>
            <p>${album.artists[0].name}</p>
          </div>
        `;

        albumItem.appendChild(trackListContainer);

        albumItem.addEventListener("click", () => {
          fetchAlbumTracks(album.id, accessToken)
            .then((trackList) => {
              const trackListElement = document.createElement("ul");
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
              createOverlay(trackListElement);
            })
            .catch((error) => console.error(error));
        });

        albumList.appendChild(albumItem);
      });
    })
    .catch((error) => console.error(error));
};

const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", searchArtist);
