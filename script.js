const bodyEl = document.body;
const coinContainerEl = document.getElementById('coin-container');
const coinInfoEl = document.getElementById('coin-info');
const timeEl = document.getElementById('time');
const weatherEl = document.getElementById('weather-container');
const weatherInfoEl = document.getElementById('weather-info');
const weatherLocationEl = document.getElementById('weather-location');
const authorEl = document.getElementById('author');
const defaultBackground = 'https://raw.githubusercontent.com/devngc/momentum/master/images/gradient.jpg';

function updateBackground(url) {
  bodyEl.style = `
  width: 100vw;
  height: 100vh;
  background: url(${url});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  `;
}

function updateAuthor(name) {
  authorEl.textContent = `by ${name}`;
}


function fetchBackground(data) {
  const url = data.urls.regular;
  const name = data.user.name;
  updateBackground(url);
  updateAuthor(name);
}

function addCrypto(data) {
  coinContainerEl.innerHTML += `
  <div>
  <img src=${data.image.thumb} id="coin-thumb">
     <p id="coin-name">bitcoin</p>
     </div>
     <div id="coin-info">
       <div>
       <p>current price: </p>
       <p>24 hour high price</p>
       <p>24 hour low price</p>
       </div>
       <div>
        <p>USD $${data.market_data.current_price.usd}</p>
        <p>USD $${data.market_data.high_24h.usd}</p>
        <p>USD $${data.market_data.low_24h.usd}</p>
       </div>
     </div>
  `; 
}

function handleCryptoError() {
  coinContainerEl.innerHTML = `
  <p>could not fetch data</p>
  `;
}



fetch('https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature')
.then(res => res.json())
.then(data => fetchBackground(data))
.catch(err => {
  console.error(`error`)
  updateBackground(defaultBackground)
});

fetch('https://api.coingecko.com/api/v3/coins/bitcoin')
.then(res => {
  if(!res.ok) {
    handleCryptoError();
  }
  return res.json();
})

.then(data => addCrypto(data))
.catch(err => console.error(err));

function updateTime() {
  const today = new Date();
  const hour = today.getHours();
  const minutes = today.getMinutes();
  const meridiem = hour < 12 ? 'AM' : 'PM';
  timeEl.innerHTML = `<h1>${hour}: ${minutes}: ${meridiem}</h1>`;
  
}

setInterval(updateTime, 60);


function updateWeather(data) {
  const city = data.name;
  const tempreature = data.main.temp;
  const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherInfoEl.innerHTML = `
  <img src=${icon}>
  <p>${Math.round(tempreature)}°C</p>
  `;
  weatherLocationEl.innerHTML = `
  <p>${city}</p>
  `;
}


function showWeather(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric`)
  .then(res => {
    if(!res.ok) {
      throw Error('error');
    }
    return res.json();
  })
  .then(data => updateWeather(data))
  .catch(err => console.error(err))
}


function handleWeatherError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
    weatherEl.innerHTML = '<p> permission denied</p>';
    break;
    case error.POSITION_UNVAILABLE:
    weatherEl.innerHTML = '<p>postion unvailable </p>';
    break;
    case error.TIMEOUT:
    weatherEl.innerHTML = '<p>request timeout </p>';
    break;
    case error.UNKNOWN_ERROR:
    weatherEl.innerHTML = '<p>unknown error </p>';
    break;
  }
}

if(navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showWeather, handleWeatherError)
}