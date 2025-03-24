let map;
let markers = [];
let currentRadius = 0; // Maximum radius (in miles) for which markers have been generated

// Initialize Google Map and use geolocation to set the center.
function initMap() {
  const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // Fallback default: New York City
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 12,
  });

  // Try HTML5 Geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // Center the map on the user's actual location.
        map.setCenter(pos);

        // Add a marker to show the user's current location.
        new google.maps.Marker({
          position: pos,
          map: map,
          title: "Your Location",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#ffffff",
          },
        });

        // On load, generate markers for the initial radius.
        currentRadius = 0; // reset current radius
        const initialRadius = parseFloat(document.getElementById("radius").value);
        // For initial load, generate markers for the entire radius.
        fetchArtists(pos, initialRadius);
        updateMapBounds(pos, initialRadius);
      },
      () => {
        // If geolocation fails, use the default location.
        currentRadius = 0;
        const initialRadius = parseFloat(document.getElementById("radius").value);
        fetchArtists(defaultLocation, initialRadius);
        updateMapBounds(defaultLocation, initialRadius);
      }
    );
  } else {
    // If browser doesn't support geolocation, use default location.
    currentRadius = 0;
    const initialRadius = parseFloat(document.getElementById("radius").value);
    fetchArtists(defaultLocation, initialRadius);
    updateMapBounds(defaultLocation, initialRadius);
  }
}

/**
 * Fetch (generate) markers based on the given location and a target radius (in miles).
 * This function only adds new markers if the target radius is larger than the currentRadius.
 */
function fetchArtists(location, targetRadiusMiles) {
  targetRadiusMiles = parseFloat(targetRadiusMiles);
  // If the target radius is less than or equal to the current maximum, do nothing.
  if (targetRadiusMiles <= currentRadius) {
    console.log("No new markers added; target radius is less than or equal to current radius.");
    return;
  }

  const centerLat = typeof location.lat === "function" ? location.lat() : location.lat;
  const centerLng = typeof location.lng === "function" ? location.lng() : location.lng;

  // Calculate annulus boundaries in degrees.
  // (Conversion: miles / 69 ≈ degrees)
  const previousRadiusDegrees = currentRadius / 69;
  const targetRadiusDegrees = targetRadiusMiles / 69;

  // Determine how many new markers to add for the additional annular area.
  // For demonstration, we'll add one marker per mile of the increase.
  const deltaRadius = targetRadiusMiles - currentRadius;
  const markerCount = Math.max(1, Math.floor(deltaRadius));

  for (let i = 0; i < markerCount; i++) {
    const angle = Math.random() * 2 * Math.PI;
    // Generate r so that r^2 is uniformly distributed between previousRadiusDegrees^2 and targetRadiusDegrees^2.
    const r = Math.sqrt(Math.random() * (targetRadiusDegrees ** 2 - previousRadiusDegrees ** 2) + previousRadiusDegrees ** 2);
    const markerLat = centerLat + r * Math.cos(angle);
    const markerLng = centerLng + r * Math.sin(angle);

    const marker = new google.maps.Marker({
      position: { lat: markerLat, lng: markerLng },
      map: map,
      title: `Artist Marker`,
    });
    markers.push(marker);
  }

  // Update the global currentRadius to the new target.
  currentRadius = targetRadiusMiles;
}

/**
 * Remove markers from the map that fall outside the given target radius (in miles)
 * from the provided center location.
 */
function removeMarkersOutside(center, targetRadiusMiles) {
  targetRadiusMiles = parseFloat(targetRadiusMiles);
  const centerLat = typeof center.lat === "function" ? center.lat() : center.lat;
  const centerLng = typeof center.lng === "function" ? center.lng() : center.lng;

  // Filter markers that are within the target radius.
  markers = markers.filter(marker => {
    const markerLat = marker.getPosition().lat();
    const markerLng = marker.getPosition().lng();
    const distance = getDistanceMiles(centerLat, centerLng, markerLat, markerLng);
    if (distance > targetRadiusMiles) {
      marker.setMap(null);
      return false;
    }
    return true;
  });
}

/**
 * Update the map bounds so that the entire circle (center + target radius in miles)
 * is visible.
 */
function updateMapBounds(center, radiusMiles) {
  // Convert miles to meters (1 mile ≈ 1609.34 meters).
  const radiusMeters = radiusMiles * 1609.34;
  const circle = new google.maps.Circle({
    center: center,
    radius: radiusMeters,
  });
  map.fitBounds(circle.getBounds());
}

/**
 * Helper function: Calculate the distance in miles between two lat/lng points using the haversine formula.
 */
function getDistanceMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

// Remove all existing markers from the map.
function clearMarkers() {
  markers.forEach((marker) => marker.setMap(null));
  markers = [];
  currentRadius = 0;
}

// Update the radius display as the slider changes.
document.getElementById("radius").addEventListener("input", function () {
  document.getElementById("radiusValue").textContent = this.value + " miles";
});

// When the "Apply Filters" button is clicked.
document.getElementById("applyFilters").addEventListener("click", function () {
  const targetRadius = parseFloat(document.getElementById("radius").value);
  const location = map.getCenter();
  if (targetRadius < currentRadius) {
    // If the new radius is smaller, remove markers outside the new radius.
    removeMarkersOutside(location, targetRadius);
    currentRadius = targetRadius;
  } else if (targetRadius > currentRadius) {
    // If the new radius is larger, add markers for the annular region.
    fetchArtists(location, targetRadius);
  }
  updateMapBounds(location, targetRadius);
});

// Initialize the map when the window loads.
window.onload = initMap;
