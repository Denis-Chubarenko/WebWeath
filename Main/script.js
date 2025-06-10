let appid = '66714c62fd1c76e1cc24f86bb8696193';




async function getWeather(lat, lon, cnt){
    let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${appid}&lang=ru&cnt=${cnt}&units=metric`;
    try{
        let response = await fetch(url);
        let dailyWeather = [];
        if(!response.ok){
            throw new Error(response.status);
        }
        let data = await response.json();
        console.log(data.list);
        let  daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));
        // for(i=0;i<= data.list.length ; i+=8){
        //     dailyWeather.push(data.list[i])
        // }
        // console.log(dailyWeather)
        console.log(daily);
        daily.forEach(day => {
            console.log(day.main.temp, day.main.humidity, day.main.pressure, day.clouds.all, day.wind.speed);
        })
    }catch(error){
        console.log(error);
    }
}
navigator.geolocation.getCurrentPosition(success, error);

function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getWeather(lat, lon, 40);
}
function error(e){
    console.log(e.message);
}


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