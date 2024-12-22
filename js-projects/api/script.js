const API_KEY = "81e19d10344193e6b10c93545ef19345";
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&q=`;
const query = document.querySelector('#city');
let city = query.value;
const secAPI = "pk.15670970c27d1bd18bb46153338d3b8e";
let cityName = document.querySelector('#cityName');
let temperature = document.querySelector('#temp');
let humidity = document.querySelector('#humidity');
let description = document.querySelector('#description');
let pressure = document.querySelector('#pressure');
let windSpeed = document.querySelector('#wind');
let icon = document.querySelector('#icon');
icon.alt = "icon";
icon.style.height = "30px";
icon.style.width = "30px";
icon.style.display = "none";

async function getWeather(city) {
    const response = await fetch(weatherUrl + city);
    const data = await response.json();
    console.log(data);
    return data;
}

document.querySelector('#submit').addEventListener('click', async () => {
    city = query.value;
    const data = await getWeather(city);
    document.querySelector('#weather').classList.add('active');
    displayWeather(data);
});


function displayWeather(data) {
    cityName.textContent = data.name;
    icon.style.display = "block";
    temperature.textContent = `Temperature: ${data.main.temp}°C`;
    icon.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    description.textContent = data.weather[0].description;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind speed: ${data.wind.speed} m/s`;
}