let map = null;

let marker = null;


function initMap() {

  map =
    L.map("map", {

      zoomControl: true

    })
    .setView(
      [36.8065, 10.1815],
      7
    );


  L.tileLayer(

    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

    {

      maxZoom: 19,

      attribution:
        "&copy; OpenStreetMap contributors"

    }

  ).addTo(map);

}


function updateMap(
  lat,
  lon,
  name
) {

  if (!map)
    initMap();


  map.setView(
    [lat, lon],
    11
  );


  if (marker)
    marker.remove();


  marker =
    L.marker([
      lat,
      lon
    ])
    .addTo(map)
    .bindPopup(
      `<b>${escapeHtml(name)}</b>`
    )
    .openPopup();


  setTimeout(
    () =>
      map.invalidateSize(),
    100
  );

}


function escapeHtml(value) {

  return String(value)
    .replace(
      /[&<>"']/g,
      character => {

        const entities = {

          "&": "&amp;",

          "<": "&lt;",

          ">": "&gt;",

          '"': "&quot;",

          "'": "&#039;"

        };


        return entities[
          character
        ];

      }
    );

}