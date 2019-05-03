
let apikey = '798422d71abce6f23b60300571e71747'; 
let units = 'imperical';
let method;

window.addEventListener('load', () => {
    let longitude;
    let latitude;
    let temperatureDescription = document.querySelector('.weather-description h3');
    let temperatureDeg = document.querySelector('.degree');
    let timezone = document.querySelector('.time-zone');
    let temperatureSection = document.querySelector('.temperature'); 
    let temperatureSpan = document.querySelector('.temperature span');

    // request access to user location upon loading the page
    if(navigator.geolocation) {
        // get the coordinated for you current location
        navigator.geolocation.getCurrentPosition
        (location => {
            //stor the coordinate longitude and latitude into variables
           longitude = location.coords.longitude;
           latitude = location.coords.latitude;
           const proxy = 'https://cors-anywhere.herokuapp.com/';
           const api = `${proxy}https://api.darksky.net/forecast/03a70601efdf246a15f41478e2e6f2c3/${latitude},${longitude}`;
            
           // retrieve the data from the weather api  using fetch then store the data recieved to a variable 
           fetch(api).then(fetchedData => {
               return fetchedData.json();
           }).then(data => {
               console.log(data);

               const {temperature, summary, icon}= data.currently;
                weatherSummary(summary);
               //set DOM elements to the retrieved API data
               temperatureDeg.textContent = temperature;
               temperatureDescription.textContent = summary;
               timezone.textContent = data.timezone;
                
               // convert to celcius
               let celcius = (temperature - 32) * (5/9);

               //set icons
               setSkycon(icon, document.querySelector('.icon'));

               // change to degrees/fahrenheit
                temperatureSection.addEventListener('click', () => {
                    if(temperatureSpan.textContent === "F") {
                        temperatureSpan.textContent = "C";
                        temperatureDeg.textContent = Math.floor(celcius);
                    }
                    else {
                        temperatureSpan.textContent = "F";
                        temperatureDeg.textContent = temperature;
                    }
                });
           });
        });
    }
    else {
        alert("Geolocation is not supported by your browser, download the latest Chrome or Firefox to use this app");
    }

   
});

function weatherSummary(smry) {
    switch(smry) {
        
        case 'Clear':
            document.body.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("../images/photo1.jpg")';
            break;
        case 'Drizzle':
        case 'Light Rain':
        case 'Rain':
            document.body.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("../images/rain.jpg")';
            break;

        case 'Overcast':
        case 'Mostly Cloudy':
            document.body.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("../images/overcast.jpg")';
            break;

        case 'Partly Cloudy':
            document.body.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("../images/partlycloudy.jpg")';

            break;

        case 'Snow':
            document.body.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("../images/snow.jpg")';
            break;

        default:
            break;
    }
}

function getSearchMethod(searchTerm) {
    if(searchTerm.length === 5 && Number.parseInt(searchTerm)+ '' === searchTerm) {
        method = 'zip';
    }
    else {
        method = 'q';
    }
}

function setSkycon(icon, id) {
    const skycons = new Skycons({color: "orange"});
    const currentIcon = icon.replace(/-/g, "-").toUpperCase();
    skycons.play();
    return skycons.set(id, Skycons[currentIcon]); 
}


function updateWeather(lon, lat) {
    let temperatureDescription = document.querySelector('.weather-description h3');
    let temperatureDeg = document.querySelector('.degree');
    let timezone = document.querySelector('.time-zone');
    let temperatureSection = document.querySelector('.temperature'); 
    let temperatureSpan = document.querySelector('.temperature span');

    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const api = `${proxy}https://api.darksky.net/forecast/03a70601efdf246a15f41478e2e6f2c3/${lat},${lon}`;
            
    // retrieve the data from the weather api  using fetch then store the data recieved to a variable 
   fetch(api).then(fetchedData => {
        return fetchedData.json();
    }).then(data => {
        console.log(data);

    const {temperature, summary, icon}= data.currently;
    weatherSummary(summary);

    //set DOM elements to the retrieved API data
    temperatureDeg.textContent = temperature;
    temperatureDescription.textContent = summary;
    timezone.textContent = data.timezone;
                
               

    //set icons
    setSkycon(icon, document.querySelector('.icon'));
    });
}

function searchWeather(locationName) {
    getSearchMethod(locationName);
    fetch(`http://api.openweathermap.org/data/2.5/weather?${method}=${locationName}&APPID=${apikey}&units=${units}`)
    .then(response => {
        return response.json();
    }).then(responseData => {
        init(responseData);
    });

}

function init(serverResponse) {
    console.log(serverResponse);
    let long = serverResponse.coord.lon;
    let lati = serverResponse.coord.lat;
    updateWeather(long, lati);
}

document.getElementById('searchButton').addEventListener('click', () => {
    let searchTerm = document.getElementById('searchInput').value;
    if(searchTerm) {
        searchWeather(searchTerm);
    }
});