// https://geo.ipify.org/api/v2/country?apiKey=at_wbZertr0lJSzK3KJdTTZJhQmmoL75&ipAddress=8.8.8.8

let api_key = "at_wbZertr0lJSzK3KJdTTZJhQmmoL75";
let address;
let country;
let region;
let timeZone;
let inputBar = document.querySelector('#input');
let search = document.querySelector('#search');

search.addEventListener('click', () => {
    address = inputBar.value.trim();
    if (address) {
        getAddress(address);
        // display country,etcetc
    } else {
        console.log("Please enter an IP address");
    }
})
async function getAddress(address) {
    try {
        let response = await fetch(`https://geo.ipify.org/api/v2/country?apiKey=${api_key}&ipAddress=${address}`);
        let data = await response.json();

        if (data.location) {
            country = data.location.country;
            region = data.location.region;
            timeZone = data.location.timezone;

            getCoordinates(region,country);
            
        } else {
            alert("Invalid IP address or API issue");
        }
    } catch (error) {
        alert("Error fetching data:", error);
    }
}

let marker;

// Function to get latitude & longitude from country + region
async function getCoordinates(region, country) {
    try {
        let geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${region},${country}`);
        let geoData = await geoResponse.json();

        if (geoData.length > 0) {
            let lat = geoData[0].lat;
            let lon = geoData[0].lon;

            // Update map view & add marker
            updateMap(lat, lon, region, country);
        } else {
            console.log("Could not find coordinates for the location");
        }
    } catch (error) {
        console.log("Error fetching coordinates:", error);
    }
}

// Function to update the map with new location
function updateMap(lat, lon, region, country) {
    map.setView([lat, lon], 19); // Zoom into the new location

    if (marker) {
        map.removeLayer(marker); // Remove previous marker
    }

    marker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`<b>${region}, ${country}</b>`) // the country name etc
        .openPopup(); // shows the popup country,etc name 
}


