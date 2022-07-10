$("#search-button").on("click", function() {
    event.preventDefault();
    console.log("hi");

})

var currentDate = ""; 
var foreCastDate = "";
var tempF = "";
var humidity = "";
var windSpeed = "";
var weatherIconCode = "";
var uvValue = "";

var APIkey = "8d1fec7b79515c9a543ff7ce14b95e18";

var weather = "https://api.openweathermap.org/data/2.5/weather?q=HIGHPOINT&appid=" + APIkey;

function currentWeather() {
    var currentDiv = $("<div class='container border bg-light'>");
    var weatherIconUrl = "https://openweathermap.org/img/w/" + weatherIconCode + ".png"
    var weatherImage = $("<img>").attr('src', weatherIconUrl);
    var weatherHeader = $("<h4>").text("high Point" + " " + currentDate.toString());
    weatherHeader.append(weatherImage);
    var temperatureEl = $("<p>").text("Temperature: " + tempF+ " ºF");
    var humidityEl = $("<p>").text("Humidity: " + humidity + "%");
    var windSpeedEl = $("<p>").text("Wind Speed: " + windSpeed + " MPH");
    var uvIndexEl = $("<p>").text("UV Index: ");
    
    var uvIndexValueEl = $("<span>").text(uvValue).css("background-color", "blue"); 
    uvIndexEl.append(uvIndexValueEl);
    currentDiv.append(weatherHeader);
    currentDiv.append(temperatureEl);
    currentDiv.append(humidityEl);
    currentDiv.append(windSpeedEl);
    currentDiv.append(uvIndexEl);
    $("#current-weather").append(currentDiv);
}



function displayDayForeCast() { 
    var forecastIconURL =  "https://openweathermap.org/img/w/" + weatherIconCode + ".png"
    var forecastImg =  $("<img>").attr('src', forecastIconURL);
    var cardEl = $("<div class='card col-lg-2 ml-3 my-3 pl-1 bg-dark text-light card-text'>");
    
    var cardTitleHeader = $("<h6>").text(foreCastDate).addClass("pt-2");
    var cardTextDiv = $("<div>").attr("class", "card-text");
    var foreCastTemp =  $("<p>").text("Temp: " + tempF+ " ºF");
    var foreCastHumidity = $("<p>").text("Humidity: " + humidity + "%");


    cardEl.append(cardTitleHeader);
    cardEl.append(forecastImg);
    cardEl.append(foreCastTemp);
    cardEl.append(foreCastHumidity)
    $("#5-days").append(cardEl);
  }

fetch(weather).then(function(response) {
  response.json().then(function(data) {
    console.log(data);
    currentDate = moment.unix(data.dt).format("l");
    console.log(currentDate)
    tempF = ((data.main.temp - 273.15)*1.8 + 32).toFixed(1);
    humidity = data.main.humidity;
    windSpeed = data.wind.speed;
    weatherIconCode = data.weather[0].icon;

    var latitude = data.coord.lat;
    var longitude = data.coord.lon;
   

    var uvIndexAPI = "https://api.openweathermap.org/data/2.5/uvi?&appid=" + APIkey + "&lat=" + latitude + "&lon=" + longitude;

    fetch(uvIndexAPI).then(function(info) {
        info.json().then(function(UV) {

            uvValue = UV.value;
            console.log(uvValue);

            currentWeather();

            var fiveDayWeatherApi = "https://api.openweathermap.org/data/2.5/forecast/daily?q=HIGHPOINT&appid=166a433c57516f51dfab1f7edaed8413&cnt=6";


            fetch(fiveDayWeatherApi).then(function(fiveDay) {
                fiveDay.json().then(function(forecast) {

                    var fiveDayWeather = forecast.list;
                    var foreCastHeader = $("<h4>").text("5-Day Forecast:").attr("id", "forecast-header");
                    foreCastHeader.addClass("pt-4 pt-2");
                    $("#5-days").before(foreCastHeader);
                    for (var i = 1; i < 6; i++) {
                        weatherIconCode = fiveDayWeather[i].weather[0].icon;
                        
                        tempF = ((fiveDayWeather[i].temp.day - 273.15)*1.8 + 32).toFixed(1);
                        humidity = fiveDayWeather[i].humidity;
                        foreCastDate =  moment.unix(fiveDayWeather[i].dt).format('l');
                        displayDayForeCast();

                    }
                   

                })
                
            })


            
        })
    })
    
  });
});



