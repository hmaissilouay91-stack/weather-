let tempChart = null;

let rainChart = null;


function destroyCharts() {

  if (tempChart)
    tempChart.destroy();


  if (rainChart)
    rainChart.destroy();

}


function makeCharts(data) {

  destroyCharts();


  const h =
    data.hourly;


  const labels =
    h.time
      .slice(0, 24)
      .map(
        time =>
          new Date(time)
            .toLocaleTimeString(
              [],
              {
                hour: "numeric"
              }
            )
      );


  const temps =
    h.temperature_2m
      .slice(0, 24);


  const rain =
    h.precipitation_probability
      .slice(0, 24);


  const gridColor =
    getComputedStyle(
      document.body
    )
      .getPropertyValue(
        "--line"
      );


  const textColor =
    getComputedStyle(
      document.body
    )
      .getPropertyValue(
        "--muted"
      );


  const common = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {

        display: false

      }

    },

    scales: {

      x: {

        ticks: {
          color: textColor
        },

        grid: {
          color: gridColor
        }

      },

      y: {

        ticks: {
          color: textColor
        },

        grid: {
          color: gridColor
        }

      }

    }

  };


  tempChart =
    new Chart(

      document.getElementById(
        "temperatureChart"
      ),

      {

        type: "line",

        data: {

          labels,

          datasets: [

            {

              data: temps,

              tension: 0.35,

              fill: true,

              borderWidth: 3,

              pointRadius: 2

            }

          ]

        },

        options: {

          ...common,

          scales: {

            ...common.scales,

            y: {

              ...common.scales.y,

              ticks: {

                color: textColor,

                callback:
                  value =>
                    value + "°"

              }

            }

          }

        }

      }

    );


  rainChart =
    new Chart(

      document.getElementById(
        "rainChart"
      ),

      {

        type: "bar",

        data: {

          labels,

          datasets: [

            {

              data: rain,

              borderRadius: 7

            }

          ]

        },

        options: {

          ...common,

          scales: {

            ...common.scales,

            y: {

              ...common.scales.y,

              min: 0,

              max: 100,

              ticks: {

                color: textColor,

                callback:
                  value =>
                    value + "%"

              }

            }

          }

        }

      }

    );

}