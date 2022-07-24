const apiKey = "d82b309829f3ddc5a3991741af2b228d";

// VARIABLES
var weatherData = {};
var locationData = {};
var cityName = ""; 
var country = "";
var searchButton = $("#search-btn");
var searchResultsArray = [];
var todayDate = moment().format("L");
$("#today").text(todayDate);

// FUNCTION TO CREATE AND ADD BUTTONS
var buttonCreator = function (i) {
    var buttonText = "";
    buttonText = `${searchResultsArray[i].city}, ${searchResultsArray[i].country}`;
    var searchResultsEl = document.getElementById("search-list");
    var newButton = document.createElement("p");
    $(newButton).text(buttonText);
    newButton.classList.add("city-btn");
    newButton.setAttribute("data-city", searchResultsArray[i].city);
    newButton.setAttribute("data-country", searchResultsArray[i].country);
    newButton.setAttribute(
        "id",
        searchResultsArray[i].city + searchResultsArray[i].country
    );
    searchResultsEl.appendChild(newButton);
};


// FUNCTION TO CREATE/DISPLAY DATA FOR NEXT 5 DAYS
var displayFiveDay = function (weatherData) {
    for (var i = 0; i < weatherData.daily.length; i++) {
        if (i > 0 && i < 6) {
            var futureDate = moment().add(i, "days").format("L");
            var icon = weatherData.daily[i].weather[0].icon;
            var icon1Address =
                "https://openweathermap.org/img/wn/" + icon + "@2x.png";
            var temp = weatherData.daily[i].temp.day;
            var wind = weatherData.daily[i].wind_speed;
            var humidity = weatherData.daily[i].humidity;
            $("#day" + i).text(futureDate);
            $("#icon" + i).attr("src", icon1Address);
            $(".icon-small").css("visibility", "visible");
            $("#temp" + i).text(temp + " °C");
            $("#wind" + i).text(wind + " KPH");
            $("#humidity" + i).text(humidity + " %");
        }
    }
};

// FUNCTION FETCHES WEATHER DATA
var getWeather = function (lat, lon) {
    var weatherUrl =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&exclude=minutely,hourly,alerts&units=metric&appid=8afb55e108bfe22e6df569f88292df63";
    console.log(weatherUrl);
    fetch(weatherUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                weatherData = data;
                var icon = weatherData.current.weather[0].icon;
                var iconAddress =
                    "https://openweathermap.org/img/wn/" + icon + "@2x.png";
                var temp = weatherData.current.temp;
                var wind = weatherData.current.wind_speed;
                var humidity = weatherData.current.humidity;
                var uvi = weatherData.current.uvi;
                if (uvi >= 7) {
                    $("#uv-index").attr("class", "red");
                } else if (uvi >= 4) {
                    $("#uv-index").attr("class", "orange");
                } else {
                    $("#uv-index").attr("class", "green");
                }
                $("#city").text(cityName + ", " + country);
                $("#icon").attr("src", iconAddress);
                $(".icon-large").css("visibility", "visible");
                $("#temperature").text(temp + " °C");
                $("#wind-speed").text(wind + " KPH");
                $("#humidity-percent").text(humidity + " %");
                $("#uv-index").text(uvi);
                displayFiveDay(weatherData);
            });
        } else {
            alert("Something went wrong!");
        }
    });
};

// FUNCTION FETCHES LOCATION DATA FOR CITY 
var getWeatherLocation = function (city, country) {
    var lat = 0;
    var lon = 0;
    var locationUrl =
        "https://api.openweathermap.org/geo/1.0/direct?q=" +
        city +
        "," +
        country +
        "&appid=8afb55e108bfe22e6df569f88292df63";
    console.log(locationUrl);
    fetch(locationUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                locationData = data;
                if (locationData.length > 0) {
                    cityName = locationData[0].name;
                    lat = locationData[0].lat;
                    lon = locationData[0].lon;
                    getWeather(lat, lon);
                    saveSearch(cityName, country);
                    document.querySelector("#city-input").value = "";
                } else {
                    alert("Location not found please try again");
                }
            });
        }
    });
};

// Event listener for search button
$(searchButton).on("click", function (event) {
    event.preventDefault();
    var city = document.querySelector("#city-input").value;
    country = document.querySelector("#country").value;
    if (city) {
        getWeatherLocation(city, country);
    }
});
