let appid = '66714c62fd1c76e1cc24f86bb8696193';




async function getWeather(lat, lon, cnt){
    let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${appid}&lang=ru&cnt=2&units=metric`;
    try{
        let response = await fetch(url);
        if(!response.ok){
            throw new Error(response.status);
        }
        let data = await response.json();
        console.log(data);
    }catch(error){
        console.log(error);
    }
}
navigator.geolocation.getCurrentPosition(success, error);

function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getWeather(lat, lon, 10);
}
function error(e){
    console.log(e.message);
}