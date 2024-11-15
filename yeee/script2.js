const apiKey = ''; //wpisz tutaj klucz api otrzymany przez twórcę


    function getWeather() {
        const city = document.getElementById('city').value;
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&hourly=1&lang=pl&aqi=yes`;

        fetch(url)
            .then(response => response.json())
            .then(data => displayWeather(data))
            .catch(error => console.error('Error:', error));
    }

    function displayWeather(data) {
        const weatherDiv = document.getElementById('weather-info');
        const hourlyDiv = document.getElementById('hourly-forecast');
        
        weatherDiv.innerHTML = '';
        hourlyDiv.innerHTML = '';

        const currentWeather = data.current;
        weatherDiv.innerHTML = `
            <h2>Aktualna temperatura w ${data.location.name}</h2>
            <p>Temperatura: ${currentWeather.temp_c}°C</p>
            <p>Zachmurzenie: ${currentWeather.condition.text}</p>
            <p>Wilgotność: ${currentWeather.humidity}%</p>
            <p>Wiatr: ${currentWeather.wind_kph} km/h ${currentWeather.wind_dir}</p>
            <p>Zanieczyszczenie: ${currentWeather.air_quality.pm10} PM10 (μg/m3)</p>
        `;

        const now = new Date();
        const hoursn = now.getHours();
        const hourlyData = data.forecast.forecastday[0].hour;
        hourlyData.forEach(hour => {
        const hourDate = new Date(hour.time_epoch * 1000);
        const hourTime = hourDate.getHours();
    if (hourTime >= hoursn) {
        const hourlyForecast = document.createElement('div');
        hourlyForecast.classList.add('hourly');
        hourlyForecast.innerHTML = `
            <h3>${hourTime}:00</h3>
            <p>Temperatura: ${hour.temp_c}°C</p>
            <p>Zachmurzenie: ${hour.condition.text}</p>
            <p>Wiatr: ${hour.wind_kph} km/h</p>
        `;
        hourlyDiv.appendChild(hourlyForecast);
    }
});
    }