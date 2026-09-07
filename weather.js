const WEATHER_CODES = {

  0: ["Clear sky", "☀️"],

  1: ["Mainly clear", "🌤️"],

  2: ["Partly cloudy", "⛅"],

  3: ["Overcast", "☁️"],

  45: ["Fog", "🌫️"],

  48: ["Rime fog", "🌫️"],

  51: ["Light drizzle", "🌦️"],

  53: ["Drizzle", "🌦️"],

  55: ["Heavy drizzle", "🌧️"],

  56: ["Freezing drizzle", "🌧️"],

  57: ["Heavy freezing drizzle", "🌧️"],

  61: ["Light rain", "🌦️"],

  63: ["Rain", "🌧️"],

  65: ["Heavy rain", "🌧️"],

  66: ["Freezing rain", "🌧️"],

  67: ["Heavy freezing rain", "🌧️"],

  71: ["Light snow", "🌨️"],

  73: ["Snow", "❄️"],

  75: ["Heavy snow", "❄️"],

  77: ["Snow grains", "❄️"],

  80: ["Rain showers", "🌦️"],

  81: ["Showers", "🌧️"],

  82: ["Heavy showers", "⛈️"],

  85: ["Snow showers", "🌨️"],

  86: ["Heavy snow showers", "❄️"],

  95: ["Thunderstorm", "⛈️"],

  96: ["Thunderstorm + hail", "⛈️"],

  99: ["Thunderstorm + heavy hail", "⛈️"]

};


function weatherInfo(code) {

  return WEATHER_CODES[code] ||
    ["Unknown", "🌡️"];

}


async function fetchWeather(
  lat,
  lon,
  tempUnit = "celsius",
  windUnit = "kmh"
) {

  const hourly = [

    "temperature_2m",

    "relative_humidity_2m",

    "apparent_temperature",

    "precipitation_probability",

    "precipitation",

    "weather_code",

    "visibility",

    "wind_speed_10m",

    "wind_direction_10m",

    "wind_gusts_10m",

    "uv_index"

  ].join(",");


  const daily = [

    "weather_code",

    "temperature_2m_max",

    "temperature_2m_min",

    "precipitation_sum",

    "precipitation_probability_max",

    "wind_speed_10m_max",

    "wind_gusts_10m_max",

    "wind_direction_10m_dominant",

    "sunrise",

    "sunset",

    "uv_index_max"

  ].join(",");


  const url =
    new URL(
      "https://api.open-meteo.com/v1/forecast"
    );


  url.search =
    new URLSearchParams({

      latitude: lat,

      longitude: lon,

      current:
        "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,pressure_msl,visibility,uv_index,is_day",

      hourly,

      daily,

      forecast_days: 7,

      timezone: "auto",

      temperature_unit: tempUnit,

      wind_speed_unit: windUnit,

      precipitation_unit: "mm"

    });


  const response =
    await fetch(url);


  if (!response.ok) {

    throw new Error(
      "Weather service is unavailable."
    );

  }


  return response.json();

}


async function geocodeCity(name) {

  const url =
    new URL(
      "https://geocoding-api.open-meteo.com/v1/search"
    );


  url.search =
    new URLSearchParams({

      name,

      count: 8,

      language: "en",

      format: "json"

    });


  const response =
    await fetch(url);


  if (!response.ok) {

    throw new Error(
      "City search failed."
    );

  }


  const data =
    await response.json();


  return data.results || [];

}


function cardinal(deg) {

  const dirs = [

    "N",
    "NE",
    "E",
    "SE",
    "S",
    "SW",
    "W",
    "NW"

  ];


  return dirs[
    Math.round(deg / 45) % 8
  ];

}


function formatTime(value) {

  if (!value) return "—";


  return new Date(value)
    .toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );

}


function formatDay(value, index) {

  if (index === 0)
    return "Today";


  if (index === 1)
    return "Tomorrow";


  return new Date(
    value + "T12:00:00"
  ).toLocaleDateString(
    [],
    {
      weekday: "short"
    }
  );

}