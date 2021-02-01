var city = "";
var lon = "";
var lat = "";
var prevSearch = [];
var prevSearchListEl = document.querySelector("#prevSearchList");

// get value from search bar
var displayWeather = function () {
    city = $("#city").val();
    //  console.log(this);
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=796327ba595030fad5c4a097b5a606d5"
    if (!searchList(city)) {
        if (prevSearch.length = 8) {
            prevSearch.pop();
        }
        prevSearch.unshift(city);
        for (var i = 0; i < 8; i++) {
            $("#prevCity" + [i]).text(prevSearch[i]);
        }
        saveCities();
    }
    fetch(apiUrl)
        .then(function (response) {
            response.json().then(function (data) {
                // console.log(data);
                lon = data.coord.lon;
                lat = data.coord.lat;
                fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=796327ba595030fad5c4a097b5a606d5")
                    .then(function (response) {
                        response.json().then(function (data) {
                            // console.log(data);
                            var today = formatDate(data.current.dt);
                            //  console.log(today);
                            //get and insert current weather data
                            $("#current-city-name").text(city);
                            $("#current-city").text(today);
                            $("#current-city-icon").attr("src", "https://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png")
                            $("#temp").text("Temperature: " + data.current.temp + " °F");
                            $("#humidity").text("Humidity: " + data.current.humidity + "%");
                            $("#wind").text("Wind Speed: " + data.current.wind_speed + " MPH");
                            $("#UV-index").text(data.current.uvi);
                            if (data.current.uvi <= 3) {
                                $("#UV-index").addClass("bg-success")
                            } else if (data.current.uvi <= 7) {
                                $("#UV-index").addClass("bg-warning")
                            } else {
                                $("#UV-index").addClass("bg-warning")
                            }

                            //get and insert 5 day forecast
                            for (var i = 0; i < 6; i++) {
                                var eachDate = formatDate(data.daily[i].dt);
                                $("#card" + [i] + "-date").text(eachDate);
                                $("#card" + [i] + "-icon").attr("src", "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png");
                                $("#card" + [i] + "-temp").text("Temp: " + data.daily[i].temp.day + " °F");
                                $("#card" + [i] + "-humidity").text("Humidity: " + data.daily[i].humidity + "%");
                            }
                        })
                    })
            })
        })
        $("#city").val("");
}

var searchList = function (cityName) {
    for (var i = 0; i < prevSearch.length; i++) {
        if (cityName === prevSearch[i]) {
            return true;
        }
    }
}

var formatDate = function (timeStamp) {
    var date = new Date(timeStamp * 1000);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    return month + "/" + day + "/" + year;

}

var searchAgain = function () {
    var prevCity = this.textContent;
    $("#city").val(prevCity);
    displayWeather();
}

var saveCities = function () {
    localStorage.setItem("cities", JSON.stringify(prevSearch));
}

var loadCities = function () {
    prevSearch = JSON.parse(localStorage.getItem("cities"));
    if (!prevSearch) {
        prevSearch = [];
    } else {
        for (var i = 0; i < 8; i++) {
            $("#prevCity" + [i]).text(prevSearch[i]);
        }
    }
}

loadCities();
$("#searchbtn").on("click", displayWeather);
$("#prevSearchList").on("click", ".prevBtn", searchAgain);