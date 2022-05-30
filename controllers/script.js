let latitude = '';
let longitude = '';
let date = new Date();
let weatherData = '';
let savedWeathers;
let weatherInfo = new Object();


const dateOptions = { weekday: "long", year: 'numeric', month: 'long', day: 'numeric' };
const background = document.querySelector('#background')
const cityName = document.querySelector('p#name');
const cityDate = document.querySelector('p#date');
const cityWeather = document.querySelector('p#weather');
const weatherIcon = document.querySelector('p#weather-icon');
const cityTemperature = document.querySelector('div#city-temperature');
const savedWeathersDiv = document.querySelector('div#saved-weathers');

const api = {
  key: "b454583c91e7916b2e10b4d4eed1fe98",
  base: "https://api.openweathermap.org/data/2.5/",
  lang: "pt_br",
  units: "metric"
};


function preLoader() {
  cityName.innerHTML = "<box-icon name='loader-alt' animation='spin' rotate='90' color='white' ></box-icon>";
  cityDate.innerText = '';
  cityWeather.innerText = '';
  cityTemperature.innerText = '';
  weatherIcon.innerHTML = '';
};


function getLocation() {
  preLoader();
  if (navigator.geolocation) {
    if (localStorage.length != 0) {
      renderSavedWeathers();
    } else {
      savedWeathers = [];
    }
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  }
  else { cityName.innerText = "Seu browser não suporta Geolocalização."; }
};

function verifyLocalStorage() {
  if (localStorage.length == 0) {
    savedWeathers = [];
  } else {
    savedWeathers = JSON.parse(localStorage.weathers);
  }
};

function setBackground(data) {
  let weatherID = data.weather[0].id
  if (date.getHours() >= 6 && date.getHours() < 18) {
    if (weatherID < 800) {
      background.style.backgroundColor = '#98b1b6'
    } else {
      background.style.backgroundColor = '#50d5f0'
    }
  } else {
    if (weatherID < 800) {
      background.style.backgroundColor = '#4b5467'
    } else {
      background.style.backgroundColor = '#364f86'
    }
  }
}

function showPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  getWeatherInfo(latitude, longitude);
};


function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      cityName.innerText = "Clique em “Permitir” e depois recarregue a página para usar o app";
      break;
    case error.POSITION_UNAVAILABLE:
      cityName.innerText = "Localização indisponível.";
      break;
    case error.TIMEOUT:
      cityName.innerText = "A requisição expirou.";
      break;
    case error.UNKNOWN_ERROR:
      cityName.innerText = "Algum erro desconhecido aconteceu. Por favor, recarregue a página";
      break;
  };
};


async function getWeatherInfo(lat, long) {
  fetch(`${api.base}weather?lat=${lat}&lon=${long}&lang=${api.lang}&units=${api.units}&appid=${api.key}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`http error: status ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      alert(error.message);
    })
    .then(response => {
      cityName.innerText = `${response.name}, ${response.sys.country}`;
      cityDate.innerText = `${date.toLocaleDateString('pt-BR', dateOptions)}`;
      cityWeather.innerText = `${(response.weather[0].description)[0].toUpperCase() + (response.weather[0].description).substring(1)}`;
      weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png" alt="Ícone de ${response.weather[0].description}">`;
      cityTemperature.innerText = `${Math.round(response.main.temp)}º C`;
      weatherData = response;
      setBackground(weatherData)
    });
}


function saveWeather() {
  date = new Date();
  weatherInfo.city = weatherData.name;
  weatherInfo.temperature = Math.round(weatherData.main.temp);
  weatherInfo.description = (weatherData.weather[0].description)[0].toUpperCase() + (weatherData.weather[0].description).substring(1);
  weatherInfo.icon = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
  weatherInfo.location = date.toLocaleDateString('pt-BR', dateOptions);
  weatherInfo.time = date.toLocaleTimeString('pt-BR');
  savedWeathers.push(weatherInfo);
  localStorage.setItem("weathers", JSON.stringify(savedWeathers));
  weatherInfo = {};
  renderSavedWeathers();
};


function renderSavedWeathers() {
  savedWeathersDiv.innerHTML = `<div id="saved-weathers-title">
                                  <p>Histórico</p>
                                  <p>
                                    <button>
                                      <box-icon name='trash' animation="tada-hover" color="white" style="cursor:pointer;" onclick="clearHistory()"></box-icon>
                                    </button>
                                  </p>
                                </div>`;
  savedWeathers.forEach((weather) => {
    savedWeathersDiv.innerHTML += `   <hr>
                                      <div class="saved-weather">
                                        <div class="city-name">
                                          <div class="name">
                                            <p>
                                              ${weather.city}
                                            </p>
                                          </div>
                                          <p class="date">${weather.time} | ${weather.location}</p>
                                        </div>
                                        <div class="city-weather">
                                          <div>
                                            <p class="weather-icon"><img src="${weather.icon}" alt="Ícone de ${weather.description}"></p>
                                            <p class="weather">${weather.description}</p>
                                          </div>
                                          <div class="city-temperature">${weather.temperature}º C</div>
                                          <div>
                                              <button>
                                                <box-icon name='x-circle' animation="tada-hover" color="white" style="cursor:pointer;" onclick="deleteSavedWeather(this)" id="${savedWeathers.indexOf(weather)}"></box-icon>
                                              </button>
                                          </div>
                                        </div>
                                      </div>
                                      `
  });
};


function deleteSavedWeather(element) {
  savedWeathers = savedWeathers.filter((item) => (savedWeathers.indexOf(item) != element.id));
  localStorage.setItem("weathers", JSON.stringify(savedWeathers));
  renderSavedWeathers();
};


function clearHistory() {
  localStorage.clear('weathers');
  verifyLocalStorage();
  renderSavedWeathers();
  alert(`O histórico foi apagado com sucesso`);
};
