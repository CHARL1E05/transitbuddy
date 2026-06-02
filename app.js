var map = L.map('map').setView([-33.817, 151.005], 11);
const checkboxes = document.getElementsByTagName('input');
for (const checkbox of checkboxes) {
  checkbox.addEventListener('click', async () => {
    await fetchBuses();
  })
  // disable data entry while loading
  checkbox.disabled = true;
}

// We have to set up the tiles for the map afterwards
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
// Get GTFS data for mapping
/*const headGtfs = await fetch(`/api/gtfs/head`);
const lastModified = await headGtfs.json();
if (!localStorage.getItem("last-modified-gtfs") || lastModified != localStorage.getItem("last-modified-gtfs")) {
  localStorage.setItem("last-modified-gtfs", `${lastModified}`);*/
for (const checkbox of checkboxes) {
  checkbox.removeAttribute('disabled');
}
//}

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
  markers = {};
  const query = [];
  for (const checkbox of checkboxes) {
    if (checkbox.checked == true) {
      query.push(true);
    } else {
      query.push(false);
    }
  }
  const result = await fetch("https://p2htubbx6rthsfndbkxzckunb40lkuti.lambda-url.ap-southeast-2.on.aws/");
  const data = await result.json();
  for (const bus of data) {
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