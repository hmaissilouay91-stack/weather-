const locationBtn =
  document.getElementById(
    "locationBtn"
  );


locationBtn.addEventListener(
  "click",
  () => {

    if (!navigator.geolocation) {

      showError(
        "Geolocation is not supported by this browser."
      );

      return;

    }


    showLoading(true);


    navigator.geolocation.getCurrentPosition(

      async position => {

        try {

          await loadLocation({

            lat:
              position.coords.latitude,

            lon:
              position.coords.longitude,

            name:
              "My location",

            country:
              ""

          });

        }

        catch (error) {

          showError(
            error.message
          );

        }

        finally {

          showLoading(false);

        }

      },


      error => {

        showLoading(false);


        showError(
          "Location permission was denied or unavailable."
        );

      },


      {

        enableHighAccuracy: true,

        timeout: 10000

      }

    );

  }
);