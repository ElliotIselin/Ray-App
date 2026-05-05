async function searchRestaurants() {
  const zip = document.getElementById("zip").value;
  const radius = document.getElementById("radius").value;
  const list = document.getElementById("results");

  list.innerHTML = "Loading...";

  try {
    // STEP 1: ZIP → coordinates (Nominatim)
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${zip}&country=USA&format=json`
    );

    const geoData = await geoRes.json();

    if (!geoData.length) {
      list.innerHTML = "ZIP not found";
      return;
    }

    const lat = geoData[0].lat;
    const lon = geoData[0].lon;

    // STEP 2: Overpass query (restaurants nearby)
    const query = `
      [out:json];
      node["amenity"="restaurant"](around:${radius*1609.34},${lat},${lon});
//      way["amenity"="restaurant"](around:${radius*1609.34},${lat},${lon});
//      relation["amenity"="restaurant"](around:${radius*1609.34},${lat},${lon});
      out;
    `;

    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query
    });

    const data = await res.json();

    // STEP 3: Display results
    list.innerHTML = "";

    if (!data.elements.length) {
      list.innerHTML = "No restaurants found nearby";
      return;
    }

    data.elements.forEach(place => {
      const li = document.createElement("li");
      const tags = place.tags || {};
      let html = `<strong>${tags.name || "Unnamed"}</strong><br>`;
      for (const key in tags) {
        if (key !== "name") {
          html += `<b>${key}:</b> ${tags[key]}<br>`;
        }
      }
      li.innerHTML = html
//      li.textContent = place
//      li.textContent = place.tags.name || "Unnamed restaurant";
      list.appendChild(li);
//      list.appendChild(place);
    });

  } catch (err) {
    console.error(err);
    list.innerHTML = "Error loading data";
  }
}
