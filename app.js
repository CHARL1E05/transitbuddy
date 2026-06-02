const o405 = document.getElementById("O405");
const o405nh = document.getElementById("O405nh");

var map = L.map('map').setView([-33.817, 151.005], 11);
const checkboxes = document.getElementsByTagName('input');
const result = await fetch("https://p2htubbx6rthsfndbkxzckunb40lkuti.lambda-url.ap-southeast-2.on.aws/");
const data = await result.json();

for (const checkbox of checkboxes) {
  checkbox.addEventListener('click', async () => {
    await fetchBuses();
  })
}

// We have to set up the tiles for the map afterwards
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var markers = {};
fetchBuses();

async function fetchBuses() {
  try {
    for (const marker of Object.entries(markers)) {
      //marker[1] is the value (marker) of the key value pair
      marker[1].remove();
    }
  } catch (e) {
    
  }

  for (const bus of data) {
    if (bus.type === "Mercedes-Benz O405" && o405.checked === false) {
        continue;
    } else if (bus.type === "Mercedes-Benz O405NH" && o405nh.checked === false) {
        continue;
    }
    markers[bus.rego] = L.marker([bus.latitude, bus.longitude]).addTo(map);
    markers[bus.rego].on('click', async () => {
      markers[bus.rego].bindPopup(`Route ${bus.route}<br>${bus.rego}<br>${bus.type}`);
      // Bring up route map using route from bus[2]
      /* Removing this code until I've made it more efficient with SQL
      const currShape = await fetch(`${SERVER_URL}/api/gtfs/${bus[5]}`);
      // Plot the array, where each entry looks like [lat, long]
      const line = await currShape.json();
      var currLine = L.polyline(line, {color: 'blue'}).addTo(map);
      map.on('click', () => {
        map.removeLayer(currLine);
      })*/
    })
  }
}