// Function to create a popup content for the hotspot marker
function createPopupContent(hotspot) {
    return `
        <strong>District:</strong> ${hotspot['District_District 1'] || hotspot['District_District 2']}<br>
        <strong>Neighborhood:</strong> ${hotspot['Neighborhood_Neighborhood 1'] || hotspot['Neighborhood_Neighborhood 2']}<br>
        <strong>NumericLocation:</strong> ${hotspot['NumericLocation']}<br>
        <strong>Hotspot Label:</strong> ${hotspot['hotspot_label']}
    `;
}

// Check if Leaflet library is loaded
if (typeof L !== 'undefined') {
    // Define the map and set the center
    var map = L.map('map').setView([51.505, -0.09], 13);

    // Add a tile layer (e.g., OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Hotspots data (replace this with the actual data)
    var hotspotsData = [
        { "District_District 1": 1, "Neighborhood_Neighborhood 1": 1, "NumericLocation": 0, "hotspot_label": 1, "District 1": 51.505, "Neighborhood 1": -0.09 },
        { "District_District 2": 1, "Neighborhood_Neighborhood 2": 1, "NumericLocation": 1, "hotspot_label": 2, "District 1": 51.51, "Neighborhood 2": -0.1 }
    ];

    // Loop through the hotspots data and add markers to the map
    hotspotsData.forEach(function(hotspot) {
        L.marker([hotspot['District 1'], hotspot['Neighborhood 1']])
            .addTo(map)
            .bindPopup(createPopupContent(hotspot));
    });
} else {
    console.error('Leaflet library is not loaded.');
}