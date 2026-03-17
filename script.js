// --- CONFIG ---
// Paste your OpenWeather API key here or leave empty for demo mode
var API_KEY = "";

var currentLat = null;
var currentLon = null;
var currentCity = null;

// --- INIT ---
window.addEventListener("load", function () {
  detectLocation();
});

function detectLocation() {
  setHint("Detecting your location...");
  if (!navigator.geolocation) {
    setHint("Geolocation not supported. Enter a city above.");
    hideShimmers();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (pos) {
      currentLat = pos.coords.latitude;
      currentLon = pos.coords.longitude;
      currentCity = null;
      setHint("Using your current location · <a onclick='resetToGeo()'>refresh</a>");
      loadWeatherByCoords(currentLat, currentLon);
    },
    function (err) {
      setHint("⚠ " + err.message + ". Enter a city above.");
      hideShimmers();
    },
    { timeout: 8000, maximumAge: 60000 }
  );
}

function searchCity() {
  var val = document.getElementById("cityInput").value.trim();
  if (!val) return;
  currentCity = val;
  currentLat = null;
  currentLon = null;
  document.getElementById("cityInput").value = "";
  setHint("Showing: " + val + " · <a onclick='resetToGeo()'>use my location</a>");
  loadWeatherByCity(val);
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("cityInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") searchCity();
  });
});

function resetToGeo() {
  currentCity = null;
  detectLocation();
}

function refresh() {
  if (currentCity) {
    loadWeatherByCity(currentCity);
  } else if (currentLat !== null) {
    loadWeatherByCoords(currentLat, currentLon);
  }
}

// --- FETCH ---
function loadWeatherByCoords(lat, lon) {
  showShimmers();
  hideCards();

  if (!API_KEY) {
    // demo mode
    setTimeout(function () {
      renderWeather(getMockData("Your Location"));
    }, 900);
    return;
  }

  fetch(
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      API_KEY +
      "&units=metric"
  )
    .then(function (r) {
      if (!r.ok) throw new Error("API error " + r.status);
      return r.json();
    })
    .then(function (data) {
      renderWeather(parseAPI(data));
    })
    .catch(function (e) {
      showError(e.message);
    });
}

function loadWeatherByCity(city) {
  showShimmers();
  hideCards();

  if (!API_KEY) {
    setTimeout(function () {
      renderWeather(getMockData(city));
    }, 900);
    return;
  }

  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      encodeURIComponent(city) +
      "&appid=" +
      API_KEY +
      "&units=metric"
  )
    .then(function (r) {
      if (!r.ok)
        throw new Error(
          r.status === 404 ? "City not found: " + city : "API error " + r.status
        );
      return r.json();
    })
    .then(function (data) {
      renderWeather(parseAPI(data));
    })
    .catch(function (e) {
      showError(e.message);
    });
}

function parseAPI(d) {
  return {
    city: d.name,
    country: d.sys ? d.sys.country : "",
    temp: Math.round(d.main.temp),
    feelsLike: Math.round(d.main.feels_like),
    humidity: d.main.humidity,
    windKmh: Math.round((d.wind ? d.wind.speed : 0) * 3.6),
    desc: d.weather[0].description,
    conditionId: d.weather[0].id,
    icon: d.weather[0].icon,
    visibility: Math.round((d.visibility || 10000) / 1000),
  };
}

function getMockData(city) {
  return {
    city: city,
    country: "IN",
    temp: 26,
    feelsLike: 27,
    humidity: 58,
    windKmh: 13,
    desc: "few clouds",
    conditionId: 801,
    icon: "02d",
    visibility: 10,
  };
}

// --- RENDER ---
function renderWeather(w) {
  hideShimmers();
  hideError();

  var label = w.city + (w.country ? ", " + w.country : "");

  // navbar location
  var nl = document.getElementById("navLocation");
  nl.textContent = "📍 " + label;
  nl.style.display = "block";

  // weather card
  document.getElementById("cityName").textContent = label;
  document.getElementById("weatherDesc").textContent = w.desc;
  document.getElementById("weatherIcon").src =
    "https://openweathermap.org/img/wn/" + w.icon + "@2x.png";
  document.getElementById("temp").textContent = w.temp + "°C";
  document.getElementById("feelsLike").textContent = "Feels like " + w.feelsLike + "°C";
  document.getElementById("wind").textContent = w.windKmh + " km/h";

  var windNote = document.getElementById("windNote");
  if (w.windKmh > 20) {
    windNote.textContent = "⚠ Above 20 km/h limit";
    windNote.className = "metric-sub warn";
  } else {
    windNote.textContent = "Within safe range";
    windNote.className = "metric-sub";
  }

  document.getElementById("humidity").textContent = w.humidity + "%";
  document.getElementById("visibility").textContent = w.visibility + " km";
  document.getElementById("weatherCard").style.display = "block";

  // flight safety
  var reasons = [];
  if (w.windKmh > 20) reasons.push("Wind " + w.windKmh + " km/h exceeds 20 km/h limit");
  var id = w.conditionId;
  if (id >= 200 && id < 300) reasons.push("Thunderstorm conditions");
  if (id >= 300 && id < 600) reasons.push("Rain or drizzle detected");
  if (id >= 600 && id < 700) reasons.push("Snow conditions");
  if (id >= 700 && id < 800) reasons.push("Poor visibility (fog / haze)");

  var safe = reasons.length === 0;
  var card = document.getElementById("safetyCard");
  var dot = document.getElementById("statusDot");
  var verdict = document.getElementById("verdict");
  var note = document.getElementById("safetyNote");
  var list = document.getElementById("reasonsList");

  dot.style.background = safe ? "var(--safe)" : "var(--danger)";
  verdict.textContent = safe ? "SAFE TO FLY" : "NOT SAFE";
  verdict.className = "safety-verdict " + (safe ? "safe" : "danger");
  note.textContent = safe
    ? "All conditions within acceptable limits."
    : reasons.length + " issue" + (reasons.length > 1 ? "s" : "") + " detected.";

  list.innerHTML = "";
  if (safe) {
    list.innerHTML =
      '<div class="reason-item"><span class="reason-check">✓</span><span>Wind, precipitation, and visibility all clear.</span></div>';
  } else {
    reasons.forEach(function (r) {
      list.innerHTML +=
        '<div class="reason-item"><span class="reason-x">✕</span><span>' + r + "</span></div>";
    });
  }

  card.className = "safety-card " + (safe ? "is-safe" : "is-danger");
  card.style.display = "block";
  document.getElementById("refreshWrap").style.display = "block";
}

// --- UI HELPERS ---
function showShimmers() {
  document.getElementById("shimmer1").style.display = "block";
  document.getElementById("shimmer2").style.display = "block";
}
function hideShimmers() {
  document.getElementById("shimmer1").style.display = "none";
  document.getElementById("shimmer2").style.display = "none";
}
function hideCards() {
  document.getElementById("weatherCard").style.display = "none";
  document.getElementById("safetyCard").style.display = "none";
  document.getElementById("refreshWrap").style.display = "none";
}
function showError(msg) {
  hideShimmers();
  var b = document.getElementById("errorBox");
  b.textContent = "⚠ " + msg;
  b.style.display = "block";
}
function hideError() {
  document.getElementById("errorBox").style.display = "none";
}
function setHint(html) {
  document.getElementById("locationHint").innerHTML = html;
}
