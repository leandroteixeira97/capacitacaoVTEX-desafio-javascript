let latitude = '';
let longitude = '';
let date = new Date()
let weatherData = ''
let savedWeathers = []
let weatherInfo = new Object()


const dateOptions = { weekday: "long", year: 'numeric', month: 'long', day: 'numeric' }
const backgroundImage = document.querySelector('body#background')
const cityName = document.querySelector('p#name')
const cityDate = document.querySelector('p#date')
const cityWeather = document.querySelector('p#weather')
const weatherIcon = document.querySelector('p#weather-icon')
const cityTemperature = document.querySelector('div#city-temperature')
const savedWeathersDiv = document.querySelector('div#saved-weathers')

const api = {
  key: "b454583c91e7916b2e10b4d4eed1fe98",
  base: "https://api.openweathermap.org/data/2.5/",
  lang: "pt_br",
  units: "metric"
}


function changeBackground() {
  if (date.getHours() >= 6 && date.getHours() < 18) {
    backgroundImage.style.background = "linear-gradient(180deg, rgba(0,120,255,1) 40%, rgba(255,180,100,1) 95%)"
  } else {
    backgroundImage.style.background = "linear-gradient(180deg, rgba(45,70,98,1) 40%, rgba(0,0,0,1) 95%)"
  }
}


function preLoader() {
  cityName.innerHTML = "<box-icon name='loader-alt' animation='spin' rotate='90' color='white' ></box-icon>"
  cityDate.innerText = ''
  cityWeather.innerText = ''
  cityTemperature.innerText = ''
  weatherIcon.innerHTML = ''
}


function getLocation() {
  changeBackground()
  preLoader()
  if (navigator.geolocation) {
    if (localStorage.length != 0) {
      savedWeathers.push(JSON.parse(localStorage.weathers))
      renderSavedWeathers()
    } else {
      savedWeathers = []
    }
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  }
  else { cityName.innerText = "Seu browser não suporta Geolocalização."; }
}


function showPosition(position) {
  latitude = position.coords.latitude
  longitude = position.coords.longitude
  getWeatherInfo(latitude, longitude)
}


function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      cityName.innerText = "Clique em “Permitir” para saber a previsão do tempo de sua localização"
      break;
    case error.POSITION_UNAVAILABLE:
      cityName.innerText = "Localização indisponível."
      break;
    case error.TIMEOUT:
      cityName.innerText = "A requisição expirou."
      break;
    case error.UNKNOWN_ERROR:
      cityName.innerText = "Algum erro desconhecido aconteceu. Por favor, recarregue a página"
      break;
  }
}


async function getWeatherInfo(lat, long) {
  fetch(`${api.base}weather?lat=${lat}&lon=${long}&lang=${api.lang}&units=${api.units}&appid=${api.key}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`http error: status ${response.status}`)
      }
      return response.json();
    })
    .catch(error => {
      alert(error.message)
    })
    .then(response => {
      if (response.weather[0].id != 800) {
        backgroundImage.style.background = "linear-gradient(180deg, rgba(187,187,187,1) 40%, rgba(29,29,29,1) 95%)"
      }
      cityName.innerText = `${response.name}, ${response.sys.country}`
      cityDate.innerText = `${date.toLocaleDateString('pt-BR', dateOptions)}`
      cityWeather.innerText = `${(response.weather[0].description)[0].toUpperCase() + (response.weather[0].description).substring(1)}`
      weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png" alt="Ícone de ${response.weather[0].description}">`
      cityTemperature.innerText = `${Math.round(response.main.temp)}º C`
      weatherData = response
    });
}


function saveWeather() {
  date = new Date()
  weatherInfo.city = weatherData.name
  weatherInfo.temperature = Math.round(weatherData.main.temp)
  weatherInfo.description = (weatherData.weather[0].description)[0].toUpperCase() + (weatherData.weather[0].description).substring(1)
  weatherInfo.icon = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
  weatherInfo.location = date.toLocaleDateString('pt-BR', dateOptions)
  weatherInfo.time = date.toLocaleTimeString('pt-BR')
  savedWeathers.push(weatherInfo)
  localStorage.setItem("weathers", JSON.stringify(savedWeathers))
  weatherInfo = {}
}


function renderSavedWeathers() {
  for(i = 0; i <= savedWeathers[0].length; i ++) {
    savedWeathersDiv.innerHTML += `<div>Teste</div>`
  }
}
