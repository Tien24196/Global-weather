$("#search-button").on("click", function() {
    event.preventDefault();
    console.log("hi");

})


var APIkey = "8d1fec7b79515c9a543ff7ce14b95e18";

var weather = "https://api.openweathermap.org/data/2.5/weather?q=HIGHPOINT&appid=" + APIkey;

fetch(weather).then(function(response) {
  response.json().then(function(data) {
    console.log(data);
    var currentDate = moment.unix(data.dt).format("l");
    console.log(currentDate)
    var tempF = ((data.main.temp - 273.15)*1.8 + 32).toFixed(1);
    console.log(tempF);
    var hummidity = data.main.humidity;
    var windSpeed = data.wind.speed;

    var latitude = data.coord.lat;
    var longitude = data.coord.lon;
   

    var uvIndexAPI = "https://api.openweathermap.org/data/2.5/uvi?&appid=" + APIkey + "&lat=" + latitude + "&lon=" + longitude;

    fetch(uvIndexAPI).then(function(info) {
        info.json().then(function(UV) {

            var uvValue = UV.value;
            console.log(uvValue)

        })
    })
    

    
  });
});