import express from "express";
import fetch from "node-detch";
//  res.send(html);
//});
//app.listen(3000m () => console.log("Server running"));

async function searchRestaurants() {
  console.log("Start")
  const zip = document.getElementById("zip").value;
  const radius = document.getElementById("radius").value;
  const list = document.getElementById("results");
  console.log("Zip:",zip,"Radius:",radius);
  list.innerHTML = "Loading...";
  try {
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${zip}&country=USA&format=json`
    );
  console.log("geoRes",geoRes)
  const geoData = await geoRes.json();
  console.log("geoData",geoData)
  if (!geoData.length) {
    list.innerHTML = "ZIP not found";
    return;
    }
  const lat = geoData[0].lat;
  const lon = geoData[0].lon;
  console.log("Lat",lat,"Lon",lon)
  const query = `
    [out:json];
    node["amenity"="restaurant"](around:${radius*1609.34},${lat},${lon});
//    way["amenity"="restaurant"](around:${radius*1609.34},${lat},${lon});
//    relation["amenity"="restaurant"](around:${radius*1609.34},${lat},${lon});
    out;
  `;
  console.log("Query",query)
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query
    });
  console.log("Res",res)
  const data = await res.json();
  console.log("Data",data);
  //console.log("tags[name]",tags["name"])
  //console.log("tags[addr:housenumber]",tags["addr:housenumber"])
  //console.log("tags[addr:street]",tags["addr:street"])
  //console.log("tags[addr:postcode]",tags["addr:postcode"])
    
  //console.log("tags.name",tags.name,"tags.addr:housenumber",tags.addr:housenumber,"tags.addr:street",tags.addr:street,"tags.addr:postcode",tags.addr:postcode)
  list.innerHTML = "";
  if (!data.elements.length) {
    list.innerHTML = "No restaurants found nearby";
    return;
    }
  data.elements.forEach(place => {
    const li = document.createElement("li");
    console.log("Li",li)
    const tags = place.tags;
    console.log("tags",tags)
    console.log("search",tags["name"],tags["addr:housenumber"],tags["addr:street"],tags["addr:postcode"])
    const app = express();
    app.get("/get-html", async (req, res) => {
      try {
        const response = await fetch(`https://google.com/search?q=${tags["name"]}+${tags["addr:housenumber"]}+${tags["addr:street"]}+${tags["addr:postcode"]}`);
        const html = await response.text();
        console.log("html",html)
        res.send(html);
      }
      catch (err) {
        res.status(500).send("Error fetching HTML");
      }
    });
    app.listen(3000, () => console.log("Running.."));
    const res = await fetch(`http://localhost:3000/get-html`);
    const html = await res.test();
    console.log("html2",html)
    li.textContent = place.tags.name || "Unnamed restaurant";
    list.appendChild(li);
    });
  } 
  catch (err) {
    console.error(err);
    list.innerHTML = "Error loading data";
  }
}
//  const zip = document.getElementById("zip").value;
//  const radius = Number(document.getElementById("radius").value);
//  const list = document.getElementById("results");

//  list.innerHTML = "Loading...";

//  try {
    // STEP 1: ZIP → coordinates (Nominatim)
//    const geoRes = await fetch(
//      `https://nominatim.openstreetmap.org/search?postalcode=${zip}&country=US&format=json`
 //   );

  //  const geoData = await geoRes.json();

    //if (!geoData.length) {
   //   list.innerHTML = "ZIP not found";
     // return;
    //}

 //   const lat = Number(geoData[0].lat);
  //  const lon = Number(geoData[0].lon);

    // STEP 2: Overpass query (restaurants nearby)
  //  const query = `
  //    [out:json];
  //    node["amenity"="restaurant"](around:${radius*1609.34},${lat},${lon});
   //   way["amenity"="restaurant"](around:${radius*1609.34},${lat},${lon});
  //    relation["amenity"="restaurant"](around:${radius*1609.34},${lat},${lon});
  //    out center tags;
  //  `;

//    const res = await fetch("https://overpass-api.de/api/interpreter", {
//      method: "POST",
//      body: query
//    });

 //   const data = await res.json();
 //   console.log("FULL RESPONSE",data);
    
    // STEP 3: Display results
 //   list.innerHTML = "";

 //   if (!data.elements.length) {
 //     list.innerHTML = "No restaurants found nearby";
  //    return;
 //   }

//    data.elements.forEach(place => {
//      const li = document.createElement("li");
//      const tags = place.tags || {};
//      console.log(place.tags);
//     let html = `<strong>${tags.name || "Unnamed"}</strong><br>`;
//      for (const key in tags) {
//        if (key !== "name") {
//          html += `<b>${key}:</b> ${tags[key]}<br>`;
//        }
//      }
//      li.innerHTML = html
//      li.textContent = place
//      li.textContent = place.tags.name || "Unnamed restaurant";
//      list.appendChild(li);
//      list.appendChild(place);
//    });
//data.elements.forEach(place => {
//  const li = document.createElement("li");
 // const tags = place.tags || {};

 // let html = `
 //   <strong>${tags.name || "Unnamed"}</strong><br>
  //  ${tags.cuisine ? `🍽️ ${tags.cuisine}<br>` : ""}
  //  ${tags["addr:street"] ? `📍 ${tags["addr:street"]}<br>` : ""}
   // ${tags.opening_hours ? `⏰ ${tags.opening_hours}<br>` : ""}
   // ${tags.phone ? `📞 ${tags.phone}<br>` : ""}
//  `;

//  li.innerHTML = html;
//  list.appendChild(li);
//});
    

//  } catch (err) {
//    console.error(err);
//    list.innerHTML = "Error loading data";
//  }
//}
