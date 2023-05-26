import {
  fetchAccessToken,
  searchAlbums,
  fetchAlbumTracks,
} from "../src/API/api.js";

import { createOverlay } from "../src/pages/overlay.js";
import {
  internetFailed,
  displayErrorMessage,
} from "../src/pages/errorHandling.js";

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
      if (albums.length === 0) {
        displayErrorMessage("No albums found for the given artist.");
      } else {
        albums.forEach((album) => {
          const albumItem = document.createElement("li");
          albumItem.classList.add("albums");
          const trackListContainer = document.createElement("div");
          trackListContainer.classList.add("trackListContainer");

          // Creating HTML structure for each album item
          albumItem.innerHTML = `
            <img class="albumImage" src="${album.images[0].url}" alt="${album.name} cover">
            <div class="albumName">
              <h3 class="albumTitle">${album.name}</h3>
              <p>${album.artists[0].name}</p>
            </div>
          `;

          albumItem.appendChild(trackListContainer);

          albumList.appendChild(albumItem);

          internetFailed(albumItem);

          // Creating the track list for each Album

          albumItem.addEventListener("click", () => {
            fetchAlbumTracks(album.id, accessToken)
              .then((trackList) => {
                if (trackList.length === 0) {
                  displayErrorMessage(
                    "No tracks found for the selected album."
                  );
                } else {
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
                }
              })
              .catch((error) => {
                console.error(error);
                displayErrorMessage(
                  "Failed to fetch track list. Please try again."
                );
              });
          });
        });
      }
    })
    .catch((error) => {
      console.error(error);
      displayErrorMessage("Please check your internet connection.");
    });
};

const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", searchArtist);
