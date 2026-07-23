const o405510 = document.getElementById("O405510");
const o405228 = document.getElementById("O405228");
const o405nh550 = document.getElementById("O405nh550");
const o405nhcb60 = document.getElementById("O405nhcb60");
const o405nhbustech = document.getElementById("O405nhbustech");
const b10m510 = document.getElementById("b10m510");
const b10m516 = document.getElementById("b10m516");
const b10blecb60 = document.getElementById("b10blecb60");
const b7rlecb60 = document.getElementById("b7rlecb60");
const route = document.getElementById("route");
const panel = document.getElementById("panel");
const btn = document.getElementById("side-panel-toggle");

btn.addEventListener("click", () => {
  panel.classList.toggle("open");
});

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
    if (bus.type === "Mercedes-Benz O405 Custom Coaches 510" && o405510.checked === false) {
        continue;
    } else if (bus.type === "Mercedes-Benz O405 Custom Coaches 228" && o405228.checked === false) {
        continue;
    } else if (bus.type === "Mercedes-Benz O405NH Custom Coaches 550" && o405nh550.checked === false) {
        continue;
    } else if (bus.type === "Mercedes-Benz O405NH Custom Coaches CB60" && o405nhcb60.checked === false) {
        continue;
    } else if (bus.type === "Mercedes-Benz O405NH Bustech" && o405nhbustech.checked === false) {
        continue;
    } else if (bus.type === "Volvo B10M Custom Coaches 516" && b10m516.checked === false) {
        continue;
    } else if (bus.type === "Volvo B10M Custom Coaches 510" && b10m510.checked === false) {
        continue;
    } else if (bus.type === "Volvo B10BLE Custom Coaches CB60" && b10blecb60.checked === false) {
      continue;
    } else if (bus.type === "Volvo B7RLE Custom Coaches CB60" && b7rlecb60.checked === false) {
      continue;
    }
    markers[bus.rego] = L.marker([bus.latitude, bus.longitude]).addTo(map);
    markers[bus.rego].bindPopup(`Route ${bus.route}<br>${bus.rego}<br>${bus.type}`);
    markers[bus.rego].on('click', async () => {
      // Bring up route map using trip. Get trip using tripId
      const tripRes = await fetch(`https://kemuwizpmfj3hx343nidqz2avy0pepjd.lambda-url.ap-southeast-2.on.aws/?trip_id=${bus.tripId}`);
      const currTrip = await tripRes.json();
      const currShape = await fetch(`https://jjtlog4mys45w2m6m7i6fo5fdu0arlrh.lambda-url.ap-southeast-2.on.aws/?shape_id=${currTrip.shape_id}`);
      // Plot the array, where each entry looks like [lat, long]
      const lineJson = await currShape.json();
      const line = lineJson.Item.points;
      console.log(currTrip, lineJson, line);
      var currLine = L.polyline(line, {color: 'blue'}).addTo(map);
      map.on('click', () => {
        map.removeLayer(currLine);
      })
    })
    markers[bus.rego].on('mouseover', async () => {
      markers[bus.rego].openPopup();
    })
    markers[bus.rego].on('mouseout', async () => {
      markers[bus.rego].closePopup();
    })
  }
}