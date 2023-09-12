// Set default filename to "jaktfelt" + today's date
const today = new Date().toISOString().slice(0, 10);
document.getElementById("filename").value = "jaktfelt" + today;

// Define UTM zone 33 with EUREF89 datum
const utm33 = "+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";

// Define WGS84 coordinate system
const wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

function convertToGpx() {
  const input = document.getElementById("coordinateInput").value.trim();
  const filename =
    document.getElementById("filename").value || "jaktfelt" + today;

  // Parse the input as JSON
  let utmCoordinates;
  try {
    utmCoordinates = JSON.parse(input);
  } catch (e) {
    alert("Det er noe feil med koordinatene");
    return;
  }

  // Convert UTM coordinates to WGS84
  const wgs84Coordinates = utmCoordinates.map((coord) => {
    return proj4(utm33, wgs84, coord);
  });

  // Create a simple GPX file
  let gpx = '<?xml version="1.0" encoding="UTF-8"?>\n';
  gpx += '<gpx version="1.1" creator="Example">\n';
  gpx += "  <trk>\n";
  gpx += `    <name>${filename}</name>\n`; // Add track names
  gpx += "    <trkseg>\n";

  for (const [lon, lat] of wgs84Coordinates) {
    gpx += `      <trkpt lat="${lat}" lon="${lon}"></trkpt>\n`;
  }

  gpx += "    </trkseg>\n";
  gpx += "  </trk>\n";
  gpx += "</gpx>";

  // Save GPX file to disk
  const blob = new Blob([gpx], { type: "application/gpx+xml" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename + ".gpx";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}

function toggleGuide(guideId, arrowId) {
  const guideContainer = document.getElementById(guideId);
  const arrow = document.getElementById(arrowId);
  if (guideContainer.style.display === "none") {
    guideContainer.style.display = "block";
    arrow.classList.add("open");
    guideContainer.scrollIntoView({ behavior: "smooth" });
  } else {
    guideContainer.style.display = "none";
    arrow.classList.remove("open");
  }
}
