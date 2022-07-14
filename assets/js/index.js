
// Set variables
var currentDate = ""; 
var foreCastDate = "";
var tempF = "";
var humidity = "";
var windSpeed = "";
var weatherIconCode = "";
var uvValue = "";
var APIkey = "166a433c57516f51dfab1f7edaed8413";
var cityName = "";
var listEl = [];



// Search button function when clicked
$("#search-button").on("click", function() {
    event.preventDefault();
    $("#current-weather").empty();
    $("#forecast-header").remove();
    $("#5-days").empty();
    resetVariables();
    cityName = $("input").val().toUpperCase().trim();
   
    $("#search-city").val("");
    searchForCity(cityName);
})


// function that displays the current weather of the searched city

function currentWeather() {
    var currentDiv = $("<div class='container border bg-light'>");
    var weatherIconUrl = "https://openweathermap.org/img/w/" + weatherIconCode + ".png"
    var weatherImage = $("<img>").attr('src', weatherIconUrl);
    var weatherHeader = $("<h4>").text(cityName + " " + currentDate.toString());
    weatherHeader.append(weatherImage);
    var temperatureEl = $("<p>").text("Temperature: " + tempF+ " ºF");
    var humidityEl = $("<p>").text("Humidity: " + humidity + "%");
    var windSpeedEl = $("<p>").text("Wind Speed: " + windSpeed + " MPH");
    var uvIndexEl = $("<p>").text("UV Index: ");

    if (uvValue <= 2) {
        var uvIndexValueEl = $("<span>").attr("class", "p-2").text(uvValue).css("background-color", "green"); 

    }

    if (uvValue > 2 && uvValue <= 5 ) {
        var uvIndexValueEl = $("<span>").attr("class", "p-2").text(uvValue).css("background-color", "yellow"); 


    }

    if ( uvValue > 5 && uvValue <= 7) {
        var uvIndexValueEl = $("<span>").attr("class", "p-2").text(uvValue).css("background-color", "orange"); 

    }

    if ( uvValue > 7 && uvValue <= 10) {
        var uvIndexValueEl = $("<span>").attr("class", "p-2").text(uvValue).css("background-color", "red"); 

    }

    if (uvValue > 10) {
        var uvIndexValueEl = $("<span>").attr("class", "p-2").text(uvValue).css("background-color", "purple"); 

    }


    
    uvIndexEl.append(uvIndexValueEl);
    currentDiv.append(weatherHeader);
    currentDiv.append(temperatureEl);
    currentDiv.append(humidityEl);
    currentDiv.append(windSpeedEl);
    currentDiv.append(uvIndexEl);
    $("#current-weather").append(currentDiv);
}


// Function that displays 5-day forecast of the searched city
function displayDayForeCast() { 

    var forecastIconURL =  "https://openweathermap.org/img/w/" + weatherIconCode + ".png"
    var forecastImg =  $("<img>").attr('src', forecastIconURL);
    var weatherImg = $("<p>").append(forecastImg);
    var cardEl = $("<div class=' card ml-3 my-3 px-3 bg-primary text-light'>");
    
    var cardTitleHeader = $("<h6>").text(foreCastDate).addClass("pt-2");
    var cardTextDiv = $("<div>").attr("class", "card-text");
    var foreCastTemp =  $("<p>").text("Temp: " + tempF+ " ºF");
    var foreCastHumidity = $("<p>").text("Humidity: " + humidity + "%");


    cardEl.append(cardTitleHeader);
    cardEl.append(weatherImg);
    cardEl.append(foreCastTemp);
    cardEl.append(foreCastHumidity)
    $("#5-days").append(cardEl);
  }

// Function to get the infomation from Openweathermap website

function searchForCity(cityName) {

    var weather = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&appid=" + APIkey; // Get current weather

    fetch(weather).then(function(response) {

    if (response.ok) {

        $("#text").text(cityName)

// save search cities to localstorage
        if (localStorage.getItem("data") == null) {
            localStorage.setItem("data", "[]");
        }
    
        if (localStorage.getItem("data").indexOf(cityName) == -1) {
    
            var newCity = JSON.parse(localStorage.getItem("data"));
            newCity.push(cityName);

         
            localStorage.setItem("data", JSON.stringify(newCity))


            
         $("#city-result").prepend(`<a href="#" class="list-group-item text-center my-1 bg-light" style="text-decoration: none; color: black;"><li style="list-style: none">${cityName}</li></a>`);
            
        }

       

        response.json().then(function(data) {
        
        currentDate = moment.unix(data.dt).format("l");
        
        tempF = ((data.main.temp - 273.15)*1.8 + 32).toFixed(1);
        humidity = data.main.humidity;
        windSpeed = data.wind.speed;
        weatherIconCode = data.weather[0].icon;

        var latitude = data.coord.lat;
        var longitude = data.coord.lon;
   

        var uvIndexAPI = "https://api.openweathermap.org/data/2.5/uvi?&appid=" + APIkey + "&lat=" + latitude + "&lon=" + longitude; // Get uv idex info

        fetch(uvIndexAPI).then(function(info) {

            info.json().then(function(UV) {

            uvValue = UV.value;
            

            currentWeather();

            var fiveDayWeatherApi = "https://api.openweathermap.org/data/2.5/forecast/daily?q=" + cityName + "&appid=" + APIkey +"&cnt=6"; // Get forecast info


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


 
} else {
    alert("Error: City is not found. Please try again!")
}

})

.catch(function(error) {
    alert("Unable to connect to OpenWeather")
})



};

// Reset the variables
function resetVariables() {
     currentDate = ""; 
     foreCastDate = "";
     tempF = "";
     humidity = "";
     windSpeed = "";
     weatherIconCode = "";
     uvValue = "";
};

// Get searched cities from local storage
listEl =  JSON.parse(localStorage.getItem("data"));

if (listEl) {
    for (var i=0; i < listEl.length; i++) {
            $("#city-result").prepend(`<a href="#" class="list-group-item text-center my-1 bg-light" style="text-decoration: none; color: black;"><li style="list-style: none">${listEl[i]}</li></a>`);
    }


// show the city's weather when saved city list is clicked
    $('#city-result').on("click", (event) => {
        event.preventDefault();
        $("#current-weather").empty();
        $("#5-days").empty();
        $("#forecast-header").remove();
        
        $('#search-city').val(event.target.textContent);

        cityName=$('#search-city').val();
        searchForCity(cityName);
       
    });

} else {

    $('#city-result').on("click", (event) => {
        event.preventDefault();
        $("#current-weather").empty();
        $("#5-days").empty();
        $("#forecast-header").remove();
        
        $('#search-city').val(event.target.textContent);
        cityName=$('#search-city').val();

        searchForCity(cityName);
        
    });
}





