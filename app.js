const state = {

  lat: 36.8065,

  lon: 10.1815,

  name: "Tunis",

  country: "Tunisia",

  unit: "celsius",

  wind: "kmh",

  weather: null

};


const $ =
  id =>
    document.getElementById(id);


/* ================= LOADING ================= */

function showLoading(on) {

  $("loading")
    .classList
    .toggle(
      "hidden",
      !on
    );

}


/* ================= ERROR ================= */

function showError(message) {

  const element =
    $("status");


  element.textContent =
    message;


  element.hidden =
    false;


  setTimeout(
    () => {

      element.hidden =
        true;

    },
    5000
  );

}


/* ================= STORAGE ================= */

function saveState() {

  localStorage.setItem(

    "weather-location",

    JSON.stringify({

      lat: state.lat,

      lon: state.lon,

      name: state.name,

      country: state.country

    })

  );

}


function loadSaved() {

  try {

    const saved =
      JSON.parse(
        localStorage.getItem(
          "weather-location"
        )
      );


    if (saved)
      return saved;

  }

  catch (error) {}


  return null;

}


/* ================= LOAD LOCATION ================= */

async function loadLocation(place) {

  state.lat =
    place.lat;


  state.lon =
    place.lon;


  state.name =
    place.name;


  state.country =
    place.country || "";


  saveState();


  showLoading(true);


  try {

    state.weather =
      await fetchWeather(

        state.lat,

        state.lon,

        state.unit,

        state.wind

      );


    renderWeather();


    updateMap(

      state.lat,

      state.lon,

      state.name

    );

  }

  catch (error) {

    showError(
      error.message
    );

  }

  finally {

    showLoading(false);

  }

}


/* ================= RENDER WEATHER ================= */

function renderWeather() {

  const weather =
    state.weather;


  const current =
    weather.current;


  const daily =
    weather.daily;


  const hourly =
    weather.hourly;


  const [
    description,
    icon
  ] =
    weatherInfo(
      current.weather_code
    );


  $("locationName")
    .textContent =
      [
        state.name,
        state.country
      ]
      .filter(Boolean)
      .join(", ");


  $("localTime")
    .textContent =
      new Date(
        current.time
      )
      .toLocaleString(
        [],
        {
          weekday: "long",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }
      );


  $("dayNight")
    .textContent =
      current.is_day
        ? "DAY"
        : "NIGHT";


  $("currentTemp")
    .textContent =
      Math.round(
        current.temperature_2m
      );


  $("tempUnit")
    .textContent =
      state.unit === "celsius"
        ? "°C"
        : "°F";


  $("weatherDescription")
    .textContent =
      description;


  $("weatherIcon")
    .textContent =
      icon;


  $("feelsLike")
    .textContent =
      `Feels like ${Math.round(
        current.apparent_temperature
      )}°`;


  $("highTemp")
    .textContent =
      `${Math.round(
        daily.temperature_2m_max[0]
      )}°`;


  $("lowTemp")
    .textContent =
      `${Math.round(
        daily.temperature_2m_min[0]
      )}°`;


  $("humidity")
    .textContent =
      `${Math.round(
        current.relative_humidity_2m
      )}%`;


  $("wind")
    .textContent =
      `${Math.round(
        current.wind_speed_10m
      )} ${
        state.wind === "kmh"
          ? "km/h"
          : "mph"
      }`;


  $("rain")
    .textContent =
      `${Number(
        current.precipitation || 0
      ).toFixed(1)} mm`;


  $("pressure")
    .textContent =
      `${Math.round(
        current.pressure_msl
      )} hPa`;


  $("visibility")
    .textContent =
      `${(
        current.visibility / 1000
      ).toFixed(1)} km`;


  $("uv")
    .textContent =
      Number(
        current.uv_index
      ).toFixed(1);


  $("sunrise")
    .textContent =
      formatTime(
        daily.sunrise[0]
      );


  $("sunset")
    .textContent =
      formatTime(
        daily.sunset[0]
      );


  $("windDirection")
    .textContent =
      `${cardinal(
        current.wind_direction_10m
      )} (${Math.round(
        current.wind_direction_10m
      )}°)`;


  $("gusts")
    .textContent =
      `${Math.round(
        current.wind_gusts_10m
      )} ${
        state.wind === "kmh"
          ? "km/h"
          : "mph"
      }`;


  $("coordinates")
    .textContent =
      `${state.lat.toFixed(3)}, ${state.lon.toFixed(3)}`;


  $("windCompass")
    .querySelector(".needle")
    .style.transform =
      `rotate(${current.wind_direction_10m}deg)`;


  renderHourly(hourly);


  renderDaily(daily);


  makeCharts(
    state.weather
  );

}


/* ================= HOURLY ================= */

function renderHourly(hourly) {

  $("hourlyForecast")
    .innerHTML =

      hourly.time
        .slice(0, 24)
        .map(
          (time, index) => {

            const [
              description,
              icon
            ] =
              weatherInfo(
                hourly.weather_code[index]
              );


            return `

              <div
                class="hour ${
                  index === 0
                    ? "active"
                    : ""
                }"
              >

                <time>

                  ${
                    index === 0
                      ? "Now"
                      : new Date(time)
                          .toLocaleTimeString(
                            [],
                            {
                              hour: "numeric"
                            }
                          )
                  }

                </time>


                <div
                  class="icon"
                  title="${description}"
                >
                  ${icon}
                </div>


                <div class="t">

                  ${Math.round(
                    hourly.temperature_2m[index]
                  )}°

                </div>


                <span
                  class="rain-prob"
                >

                  ☔ ${
                    hourly
                      .precipitation_probability[index] || 0
                  }%

                </span>

              </div>

            `;

          }
        )
        .join("");

}


/* ================= DAILY ================= */

function renderDaily(daily) {

  $("dailyForecast")
    .innerHTML =

      daily.time
        .map(
          (time, index) => {

            const [
              description,
              icon
            ] =
              weatherInfo(
                daily.weather_code[index]
              );


            return `

              <div class="day-row">

                <div class="day-name">

                  ${formatDay(
                    time,
                    index
                  )}

                  <small
                    class="muted"
                    style="
                      display:block
                    "
                  >

                    ${description}

                  </small>

                </div>


                <div class="day-icon">

                  ${icon}

                </div>


                <div class="day-rain">

                  ☔ ${
                    daily
                      .precipitation_probability_max[index] || 0
                  }%

                </div>


                <div class="day-temp">

                  ${
                    Math.round(
                      daily.temperature_2m_max[index]
                    )
                  }°

                  /

                  ${
                    Math.round(
                      daily.temperature_2m_min[index]
                    )
                  }°

                </div>

              </div>

            `;

          }
        )
        .join("");

}


/* ================= THEME ================= */

$("themeBtn")
  .addEventListener(
    "click",
    () => {

      document.body
        .classList
        .toggle("dark");


      localStorage.setItem(

        "weather-theme",

        document.body
          .classList
          .contains("dark")
          ? "dark"
          : "light"

      );


      if (state.weather)
        makeCharts(
          state.weather
        );

    }
  );


/* ================= UNIT ================= */

$("unitBtn")
  .addEventListener(
    "click",
    async () => {

      state.unit =
        state.unit === "celsius"
          ? "fahrenheit"
          : "celsius";


      $("unitBtn")
        .textContent =
          state.unit === "celsius"
            ? "°C"
            : "°F";


      await loadLocation({

        lat: state.lat,

        lon: state.lon,

        name: state.name,

        country: state.country

      });

    }
  );


/* ================= LOAD THEME ================= */

if (
  localStorage.getItem(
    "weather-theme"
  ) === "dark"
) {

  document.body
    .classList
    .add("dark");

}


/* ================= START APP ================= */

const saved =
  loadSaved();


loadLocation(

  saved || {

    lat:
      state.lat,

    lon:
      state.lon,

    name:
      state.name,

    country:
      state.country

  }

);