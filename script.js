document.getElementById("searchBtn").addEventListener("click", () => {
    const city = document.getElementById("cityField").value.trim();
    if (city) {
      getCoordinates(city);
    } else {
      showError("Please enter a city name");
    }
  });



  async function getCoordinates(city) {
    showError("");
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );
  
      if (!response.ok) {
        throw new Error("City not found");
      }
  
      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        throw new Error("Location not found");
      }
  
      const { latitude, longitude, name, country } = data.results[0];
      getWeather(latitude, longitude, name, country);
    } catch (error) {
      showError(error.message);
    }
  }



  async function getWeather(latitude, longitude, city, country) {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
  
      if (!response.ok) {
        throw new Error("Weather data not available");
      }
  
      const data = await response.json();
      displayWeather(data.current_weather, city, country);
    } catch (error) {
      showError(error.message);
    }
  }





  function displayWeather(weather, city, country) {
    const weatherContainer = document.getElementById("weatherContainer");
    const cityHeader = document.getElementById("cityName");
    const temp = document.getElementById("temperature");
    const condition = document.getElementById("condition");
    const windSpeed = document.getElementById("windSpeed");
  
    const weatherCondition =
      weatherDescriptions[weather.weathercode] || "Unknown Condition";
  
    weatherContainer.style.display = "block";
    cityHeader.textContent = `${city}, ${country}`;
    temp.textContent = `Temperature: ${weather.temperature}°C`;
    condition.textContent = `Condition: ${weatherCondition}`;
    windSpeed.textContent = `Wind Speed: ${weather.windspeed} km/h`;
  }


  function showError(message) {
    const weatherContainer = document.getElementById("weatherContainer");
    weatherContainer.style.display = "none";
    const errorPara = document.getElementById("errorMessage");
    errorPara.textContent = message;
  }