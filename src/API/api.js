export function fetchAccessToken() {
  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        btoa(
          "795d2a19151a4e14904f6c4479debf47:fe64ff9addf14d88b9a3c287f97fca33"
        ),
    },
    body: "grant_type=client_credentials",
  })
    .then((response) => response.json())
    .then((data) => data.access_token);
}

export function searchAlbums(query, accessToken) {
  return fetch(`https://api.spotify.com/v1/search?q=${query}&type=album`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  })
    .then((response) => response.json())
    .then((data) => data.albums.items);
}

export function fetchAlbumTracks(albumId, accessToken) {
  return fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  })
    .then((response) => response.json())
    .then((data) => data.items);
}
