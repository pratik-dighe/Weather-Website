var map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(map);

var marker = L.marker([0, 0]).addTo(map);

document.getElementById('searchButton').addEventListener('click', function() {
    var locationInput = document.getElementById('locationInput');
    var location = locationInput.value;
    searchForLocation(location);
});

function searchForLocation(location) {
    var url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + location;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                var lat = parseFloat(data[0].lat);
                var lon = parseFloat(data[0].lon);

                marker.setLatLng([lat, lon]);
                map.setView([lat, lon], 12);

                fetchClimateData(lat, lon);
            } else {
                console.log('Location not found.');
            }
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

function fetchClimateData(lat, lon) {
    var apiKey = '9f37e5bf04625fa40b36fee3910e7866';
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            var temperatureElement = document.getElementById('temperature');
            var weatherDescriptionElement = document.getElementById('weatherDescription');

            if (data.main && data.weather) {
                var temperature = data.main.temp;
                var weatherDescription = data.weather[0].description;

                temperatureElement.textContent = temperature + '°C';
                weatherDescriptionElement.textContent = weatherDescription;
            } else {
                console.log('Climate data not found.');
            }
        })
        .catch(error => {
            console.log('Error:', error);
        });
}
