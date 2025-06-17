const appid = '66714c62fd1c76e1cc24f86bb8696193';
const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const list = document.getElementById('lists');
const overlay = document.getElementById('overlay');
const cityName = document.getElementById('cityName');
const input = document.getElementById('city-input');

btn1.addEventListener('click', function (event) {
    event.stopPropagation();
    list.classList.toggle('visible');
    overlay.classList.toggle('visible')
});
input.addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // отменяем стандартное поведение (например, отправку формы)
    btn2.click(); // эмулируем нажатие кнопки
  }
});

// Закрытие по клику вне списка
document.addEventListener('click', function (event) {
    // если клик был НЕ по кнопке и НЕ по списку
    if (!list.contains(event.target) && event.target !== btn1) {
        list.classList.remove('visible');
    }
});
document.addEventListener('click', function (event) {
    if (!list.contains(event.target) && event.target !== btn1) {
        list.classList.remove('visible');
        overlay.classList.remove('visible');
    }
});


function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function saveSearch(city) {
  let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
  
  // Удаляем дубликаты
  history = history.filter(item => item !== city);
  history.unshift(city); // добавляем в начало

  // Ограничим историю до 5 последних записей (можно изменить)
  history = history.slice(0, 5);

  localStorage.setItem('searchHistory', JSON.stringify(history));
  renderSearchHistory();
}

function renderSearchHistory() {
  const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
  const list = document.getElementById('lists');

  list.innerHTML = ''; // очистка списка

  history.forEach(city => {
    const li = document.createElement('li');
    li.className = 'list';
    li.textContent = city;
    
    // При клике на элемент истории — получаем погоду для него
    li.addEventListener('click', () => {
      fetchWeatherByCity(city);
    });

    list.appendChild(li);
  });
}
async function fetchWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${appid}&lang=ru&units=metric`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    // console.log(data);
    // сохраняем координаты в localStorage, если нужно
    const lat = data.city.coord.lat;
    const lon = data.city.coord.lon;
    // localStorage.setItem('lat', lat);
    // localStorage.setItem('lon', lon);

    saveSearch(city); // сохраняем в историю
    getWeather(lat, lon, 40); // вызываем уже существующую функцию

  } catch (err) {
    alert('Місто не знайдено');
    console.log(err);
  }
}
window.addEventListener('load', () => {
  renderSearchHistory();
});
function searchCity() {
  const input = document.getElementById('city-input').value.trim();
  document.getElementById('city-input').value = '';
  if (input) {
    fetchWeatherByCity(input);
  }
}


async function getWeather(lat, lon, cnt) {
    let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${appid}&lang=ua&cnt=${cnt}&units=metric`;
    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error(response.status);

        let data = await response.json();
        let daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));
        let container = document.querySelector(".other-days");
        container.innerHTML = ''; // очищаем старый контент
        console.log(data);

        const cityTranslations = {
            "Kyiv": "Київ",
            "Lviv": "Львів",
            "Odesa": "Одеса",
            "Kharkiv": "Харків",
            "Dnipro": "Дніпро",
            "Zaporizhia": "Запоріжжя",
            "Mykolaiv": "Миколаїв",
            "Vinnytsia": "Вінниця",
            "Chernihiv": "Чернігів",
            "Poltava": "Полтава",
            "Sumy": "Суми"
        };

        const originalName = data.city.name;
        const localizedName = cityTranslations[originalName] || originalName;
        cityName.innerHTML = localizedName;



        const current = data.list[0]; // ближайший прогноз

        const currentDate = new Date(current.dt_txt);
        const optionsFull = { weekday: 'long', day: 'numeric', month: 'long' };
        const formattedCurrentDate = capitalizeFirstLetter(currentDate.toLocaleDateString('uk-UA', optionsFull));

        // данные
        const currentTemp = Math.round(current.main.temp);
        const currentHumidity = current.main.humidity;
        const currentClouds = current.clouds.all;
        const currentWind = current.wind.speed;
        const currentRain = current.rain?.['3h'] ?? 0;
        const currentIcon = current.weather[0].icon;

        // Вставка в .current-day
        document.querySelector('.frame-27 ._20').innerHTML = `+${currentTemp}&deg;C`;
        document.querySelector('.frame-28 ._202').innerHTML = formattedCurrentDate;
        document.querySelectorAll('.frame-23 .div3')[0].innerHTML = `Вологість,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%:&nbsp;&nbsp;&nbsp;&nbsp; ${currentHumidity}`;
        document.querySelectorAll('.frame-23 .div3')[1].innerHTML = `Хмарність,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%: &nbsp;&nbsp;&nbsp;&nbsp;${currentClouds}`;
        document.querySelectorAll('.frame-23 .div3')[2].innerHTML = `Шв. вітру,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;м/с:&nbsp;&nbsp;&nbsp;&nbsp; ${currentWind}`;
        document.querySelectorAll('.frame-23 .div3')[3].innerHTML = `Кількість опадів:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${currentRain}`;

        // document.querySelector('.streamline-ultimate-color-weather-sun svg').style.display = 'none';
        const iconContainer = document.querySelector('.streamline-ultimate-color-weather-sun');
        iconContainer.innerHTML = '';
        iconContainer.innerHTML = `<img class="img" src="https://openweathermap.org/img/wn/${currentIcon}@2x.png" width="100">`;




        daily.slice(0, 5).forEach(day => {
            // дата и температура
            const date = new Date(day.dt_txt);
            const options = { weekday: 'short', day: 'numeric', month: 'long' };
            const formattedDate = capitalizeFirstLetter(date.toLocaleDateString('uk-UA', options));
            const temp = Math.round(day.main.temp);

            // влажность, облачность, ветер
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
                            <!-- Тут может быть SVG или иконка по погоде -->
                            <img class="img" src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" width="60">
                        </div>
                    </div>
                </div>
                <div class="second-content">
                    <div class="_30">Вологість,&nbsp; %: ${humidity}</div>
                    <div class="_45">Хмарність, %: ${clouds}</div>
                    <div class="_7">Шв. вітру, м/с: ${wind}</div>
                </div>
            `;

            container.appendChild(div);
        });
    } catch (error) {
        console.log(error);
    }
}

if (localStorage.getItem('lat') && localStorage.getItem('lon')) {
    getWeather(localStorage.getItem('lat'), localStorage.getItem('lon'), 40);
} else {
    navigator.geolocation.getCurrentPosition(success, error);
}

function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    localStorage.setItem('lat', lat);
    localStorage.setItem('lon', lon);
    getWeather(lat, lon, 40);
}
function error(e) {
    console.log(e.message);

    // Город по умолчанию: Киев
    const defaultLat = 50.4357;
    const defaultLon = 30.5264;
    getWeather(defaultLat, defaultLon, 40);
}


// localStorage.clear();
// main
// :
// feels_like
// :
// 27.86
// grnd_level
// :
// 996
// humidity
// :
// 45
// pressure
// :
// 1015
// sea_level
// :
// 1015
// temp
// :
// 27.83
// temp_kf
// :
// 0
// temp_max
// :
// 27.83
// temp_min
// :
// 27.83