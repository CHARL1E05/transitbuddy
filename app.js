const o405 = document.getElementById("O405");
const o405nh = document.getElementById("O405nh");
const route = document.getElementById("route");

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
    // If not a route service but route services only is checked, skip
    if (bus.routeService === false && route.checked === true) {
        continue;
    }
    if (bus.type === "Mercedes-Benz O405" && o405.checked === false) {
        continue;
    } else if (bus.type === "Mercedes-Benz O405NH" && o405nh.checked === false) {
        continue;
    }
    markers[bus.rego] = L.marker([bus.latitude, bus.longitude]).addTo(map);
    markers[bus.rego].on('click', async () => {
      markers[bus.rego].bindPopup(`Route ${bus.route}<br>${bus.rego}<br>${bus.type}`);
      // Bring up route map using trip. Get trip using tripId
      console.log(bus);
      const currTrip = await fetch(`https://kemuwizpmfj3hx343nidqz2avy0pepjd.lambda-url.ap-southeast-2.on.aws/?trip_id=${bus.entity.vehicle.trip.tripId}`);
      const currShape = await fetch(`https://jjtlog4mys45w2m6m7i6fo5fdu0arlrh.lambda-url.ap-southeast-2.on.aws/?shape_id=${currTrip.shape_id}`);
      // Plot the array, where each entry looks like [lat, long]
      const lineJson = await currShape.json();
      const line = lineJson.points;
      var currLine = L.polyline(lineJson, {color: 'blue'}).addTo(map);
      map.on('click', () => {
        map.removeLayer(currLine);
      })
    })
  }
}