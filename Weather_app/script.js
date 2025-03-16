const apiKey = '110630e3ec510285b7aecefd3a8de014';
let isCelsius = true;

async function getWeather() {
  const city = document.getElementById('city').value;
  if (!city) return;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${isCelsius ? 'metric' : 'imperial'}`;

  try {
    const res = await fetch(url, { mode: 'cors' });
    const data = await res.json();

    console.log(data);

    if (data.cod !== 200) {
      alert(`Error: ${data.message}`);
      return;
    }

    updateWeatherInfo(data);
    getHourlyForecast(city);
  } catch (error) {
    console.error('Fetch Error:', error);
    alert('Failed to fetch weather data.');
  }
}

function updateWeatherInfo(data) {
  document.getElementById('city-name').innerText = data.name;
  document.getElementById('temperature').innerText = `${Math.round(data.main.temp)}°${isCelsius ? 'C' : 'F'}`;
  document.getElementById('description').innerText = data.weather[0].description;
  document.getElementById('humidity').innerText = `${data.main.humidity}%`;
  document.getElementById('wind-speed').innerText = `${data.wind.speed} m/s`;

  const mainWeather = data.weather[0].main.toLowerCase();
  if (mainWeather.includes('rain')) {
    document.body.className = 'rainy';
  } else if (mainWeather.includes('cloud')) {
    document.body.className = 'cloudy';
  } else if (mainWeather.includes('snow')) {
    document.body.className = 'snowy';
  } else {
    document.body.className = 'sunny';
  }
}

async function getHourlyForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${isCelsius ? 'metric' : 'imperial'}`;

  try {
    const res = await fetch(url, { mode: 'cors' });
    const data = await res.json();

    console.log(data);

    if (data.cod !== 200) {
      alert(`Error: ${data.message}`);
      return;
    }

    const forecastContainer = document.getElementById('hourly-forecast');
    forecastContainer.innerHTML = '';

    for (let i = 0; i < 5; i++) {
      const forecast = data.list[i];
      const hourBlock = document.createElement('div');
      hourBlock.className = 'hour';
      hourBlock.innerHTML = `
        <p>${new Date(forecast.dt * 1000).getHours()}:00</p>
        <p>${Math.round(forecast.main.temp)}°${isCelsius ? 'C' : 'F'}</p>
        <p>${forecast.weather[0].description}</p>
      `;
      forecastContainer.appendChild(hourBlock);
    }

    // Update background based on hourly weather
    const mainWeather = data.list[0].weather[0].main.toLowerCase();
    if (mainWeather.includes('rain')) {
      document.body.className = 'rainy';
    } else if (mainWeather.includes('cloud')) {
      document.body.className = 'cloudy';
    } else if (mainWeather.includes('snow')) {
      document.body.className = 'snowy';
    } else {
      document.body.className = 'sunny';
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    alert('Failed to fetch hourly forecast.');
  }
}

function toggleUnit() {
  isCelsius = !isCelsius;
  getWeather();
  getHourlyForecast(document.getElementById('city').value);
}

window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoords(latitude, longitude);
      },
      error => {
        console.error('Geolocation Error:', error);
        alert(`Geolocation Error: ${error.message}`);
      }
    );
  }
};

async function getWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${isCelsius ? 'metric' : 'imperial'}`;

  try {
    const res = await fetch(url, { mode: 'cors' });
    const data = await res.json();

    console.log(data);

    if (data.cod !== 200) {
      alert(`Error: ${data.message}`);
      return;
    }

    updateWeatherInfo(data);
  } catch (error) {
    console.error('Fetch Error:', error);
    alert('Failed to fetch weather data by coordinates.');
  }
}
