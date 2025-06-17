// API-ключ для OpenWeather
const appid = '66714c62fd1c76e1cc24f86bb8696193';

// Отримання елементів з DOM
const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const list = document.getElementById('lists');
const overlay = document.getElementById('overlay');
const cityName = document.getElementById('cityName');
const input = document.getElementById('city-input');

// Відкриття/закриття списку історії
btn1.addEventListener('click', function (event) {
  event.stopPropagation();
  list.classList.toggle('visible');
  overlay.classList.toggle('visible');
});

// Виклик кнопки пошуку при натисканні Enter
input.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    btn2.click();
  }
});

// Закриття списку при кліку поза межами
document.addEventListener('click', function (event) {
  if (!list.contains(event.target) && event.target !== btn1) {
    list.classList.remove('visible');
    overlay.classList.remove('visible');
  }
});

// Функція: робить першу літеру великою
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Функція: зберігає місто до історії пошуку
function saveSearch(city) {
  let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
  history = history.filter(item => item !== city);
  history.unshift(city);
  history = history.slice(0, 5);
  localStorage.setItem('searchHistory', JSON.stringify(history));
  renderSearchHistory();
}

// Функція: відображає історію пошуку у списку
function renderSearchHistory() {
  const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
  const list = document.getElementById('lists');
  list.innerHTML = '';
  history.forEach(city => {
    const li = document.createElement('li');
    li.className = 'list';
    li.textContent = city;
    li.addEventListener('click', () => {
      fetchWeatherByCity(city);
    });
    list.appendChild(li);
  });
}

// Функція: отримує погоду за назвою міста
async function fetchWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${appid}&lang=ru&units=metric`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    const lat = data.city.coord.lat;
    const lon = data.city.coord.lon;
    saveSearch(city);
    getWeather(lat, lon, 40);
  } catch (err) {
    alert('Місто не знайдено');
    console.log(err);
  }
}

// Функція: обробляє пошук по введеному місту
function searchCity() {
  const inputValue = document.getElementById('city-input').value.trim();
  document.getElementById('city-input').value = '';
  if (inputValue) {
    fetchWeatherByCity(inputValue);
  }
}

// Функція: основне завантаження погоди за координатами
async function getWeather(lat, lon, cnt) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${appid}&lang=ua&cnt=${cnt}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(response.status);
    const data = await response.json();
    const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));
    const container = document.querySelector(".other-days");
    container.innerHTML = '';

    // Локалізація назв міст
    const cityTranslations = {
      "Kyiv": "Київ", "Lviv": "Львів", "Odesa": "Одеса", "Kharkiv": "Харків",
      "Dnipro": "Дніпро", "Zaporizhia": "Запоріжжя", "Mykolaiv": "Миколаїв",
      "Vinnytsia": "Вінниця", "Chernihiv": "Чернігів", "Poltava": "Полтава", "Sumy": "Суми"
    };

    const originalName = data.city.name;
    const localizedName = cityTranslations[originalName] || originalName;
    cityName.innerHTML = localizedName;

    // Поточна погода
    const current = data.list[0];
    const currentDate = new Date(current.dt_txt);
    const optionsFull = { weekday: 'long', day: 'numeric', month: 'long' };
    const formattedCurrentDate = capitalizeFirstLetter(currentDate.toLocaleDateString('uk-UA', optionsFull));

    const currentTemp = Math.round(current.main.temp);
    const currentHumidity = current.main.humidity;
    const currentClouds = current.clouds.all;
    const currentWind = current.wind.speed;
    const currentRain = current.rain?.['3h'] ?? 0;
    const currentIcon = current.weather[0].icon;

    // Виведення даних поточного дня
    document.querySelector('.frame-27 ._20').innerHTML = `+${currentTemp}&deg;C`;
    document.querySelector('.frame-28 ._202').innerHTML = formattedCurrentDate;
    document.querySelectorAll('.frame-23 .div3')[0].innerHTML = `Вологість:&nbsp;&nbsp;${currentHumidity}%`;
    document.querySelectorAll('.frame-23 .div3')[1].innerHTML = `Хмарність:&nbsp;&nbsp;${currentClouds}%`;
    document.querySelectorAll('.frame-23 .div3')[2].innerHTML = `Шв. вітру:&nbsp;&nbsp;${currentWind} м/с`;
    document.querySelectorAll('.frame-23 .div3')[3].innerHTML = `Кількість опадів:&nbsp;&nbsp;${currentRain} мм`;

    const iconContainer = document.querySelector('.streamline-ultimate-color-weather-sun');
    iconContainer.innerHTML = `<img class="img" src="https://openweathermap.org/img/wn/${currentIcon}@2x.png" width="100">`;

    // Прогноз на наступні дні
    daily.slice(0, 5).forEach(day => {
      const date = new Date(day.dt_txt);
      const options = { weekday: 'short', day: 'numeric', month: 'long' };
      const formattedDate = capitalizeFirstLetter(date.toLocaleDateString('uk-UA', options));
      const temp = Math.round(day.main.temp);
      const humidity = day.main.humidity;
      const clouds = day.clouds.all;
      const wind = day.wind.speed;

      const div = document.createElement('div');
      div.className = 'day-1';
      div.innerHTML = `
        <div class="main-content">
          <div class="date">
            <div class="_203">${formattedDate}</div>
            <div class="_20-c">+ ${temp}°C</div>
          </div>
          <div class="logo2">
            <div class="streamline-ultimate-color-weather-sun2">
              <img class="img" src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" width="60">
            </div>
          </div>
        </div>
        <div class="second-content">
          <div class="_30">Вологість: ${humidity}%</div>
          <div class="_45">Хмарність: ${clouds}%</div>
          <div class="_7">Шв. вітру: ${wind} м/с</div>
        </div>
      `;
      container.appendChild(div);
    });

  } catch (error) {
    console.log(error);
  }
}

// При завантаженні — рендер історії
window.addEventListener('load', () => {
  renderSearchHistory();
});

// Якщо координати вже є — завантажити погоду
if (localStorage.getItem('lat') && localStorage.getItem('lon')) {
  getWeather(localStorage.getItem('lat'), localStorage.getItem('lon'), 40);
} else {
  navigator.geolocation.getCurrentPosition(success, error);
}

// Функція: обробка успішного визначення геолокації
function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  localStorage.setItem('lat', lat);
  localStorage.setItem('lon', lon);
  getWeather(lat, lon, 40);
}

// Функція: якщо користувач не дозволив геолокацію — встановити Київ
function error(e) {
  console.log(e.message);
  const defaultLat = 50.4357;
  const defaultLon = 30.5264;
  getWeather(defaultLat, defaultLon, 40);
}
