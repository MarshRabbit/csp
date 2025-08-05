"use strict";
 (function() {
    const API_KEY = 'INSERT OPENWEATHER API';

    window.addEventListener("load", init);

    function init() {
      loadRecentCities()
      id('search-btn').addEventListener('click', () => {
        let city = id('city-input').value;
        if (city != '') {
          searchCity(city);
        }
      });
    }

    function searchCity(city) {
      const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + API_KEY + "&lang=kr&units=metric";

      fetch(url)
        .then(response => {
          if (!response.ok) {
              throw new Error('도시를 찾을 수 없습니다.');
          }
          return response.json();
        })
        .then(data => {
          showWeather(data);
          saveRecentCity(city);    
          loadRecentCities();  
          id("error-message").classList.add('hidden');
        })
        .catch(err => {
          showError(err.message);
        });
    }

    function showWeather(data) {
      let city = data.name;
      let country = data.sys.country
      let temp = data.main.temp.toFixed(1);
      let description = data.weather[0].description;
      let iconCode = data.weather[0].icon;
      let mainWeather = data.weather[0].main;
  
      id("city-name").textContent = city;
      id("country").textContent = country;
      id("temperature").textContent = temp;
      id("weather-description").textContent = description;
      id("weather-icon").src = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
      id("weather-info").classList.remove("hidden");

      updateBackground(mainWeather);
    }

    function saveRecentCity(city) {
      let recent = JSON.parse(localStorage.getItem("recentCities")) || [];
      
      recent = recent.filter(item => item.toLowerCase() !== city.toLowerCase());
      recent.unshift(city);
      
      if (recent.length > 5) {
        recent = recent.slice(0, 5);
      }

      localStorage.setItem("recentCities", JSON.stringify(recent));
    }

    function loadRecentCities() {
      let recent = JSON.parse(localStorage.getItem("recentCities")) || [];
      id("recent-list").innerHTML = "";
      
      recent.forEach(city => {
          let btn = document.createElement("button");
          btn.textContent = city;
          btn.addEventListener("click", () => {
            searchCity(city);
          });
          id("recent-list").appendChild(btn);
      });
    }

    function updateBackground(weatherMain) {
      let body = document.body;
      
      body.className = ''; 
      
      switch (weatherMain.toLowerCase()) {
        case 'clear':
          body.classList.add('clear');
          break;
        case 'clouds':
          body.classList.add('clouds');
          break;
        case 'rain':
        case 'drizzle':
        case 'thunderstorm':
          body.classList.add('rain');
          break;
        case 'snow':
          body.classList.add('snow');
          break;
        default:
          body.classList.add('default');
          break;
        }
      }
    

    function showError(msg) {
      id("error-message").textContent = msg;
      id("error-message").classList.remove("hidden");
      id("weather-info").classList.add("hidden");
    }


    function id(idName) {
      return document.getElementById(idName);
    }
})();
