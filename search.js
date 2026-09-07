const searchForm =
  document.getElementById("searchForm");


const cityInput =
  document.getElementById("cityInput");


const searchResults =
  document.getElementById("searchResults");


let searchTimer;


cityInput.addEventListener(
  "input",
  () => {

    clearTimeout(searchTimer);


    const q =
      cityInput.value.trim();


    if (q.length < 2) {

      searchResults.hidden = true;

      return;

    }


    searchTimer =
      setTimeout(
        async () => {

          try {

            const results =
              await geocodeCity(q);


            searchResults.innerHTML =
              "";


            results.forEach(
              place => {

                const btn =
                  document.createElement(
                    "button"
                  );


                btn.className =
                  "result";


                btn.textContent =
                  [
                    place.name,
                    place.admin1,
                    place.country
                  ]
                  .filter(Boolean)
                  .join(", ");


                btn.addEventListener(
                  "click",
                  () =>
                    selectLocation(place)
                );


                searchResults.appendChild(
                  btn
                );

              }
            );


            searchResults.hidden =
              !results.length;

          }

          catch (error) {

            searchResults.hidden =
              true;

          }

        },
        350
      );

  }
);


searchForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    const q =
      cityInput.value.trim();


    if (!q) return;


    try {

      showLoading(true);


      const results =
        await geocodeCity(q);


      if (!results.length) {

        throw new Error(
          "No city found."
        );

      }


      await selectLocation(
        results[0],
        false
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
);


async function selectLocation(
  place,
  hide = true
) {

  if (hide)
    searchResults.hidden = true;


  cityInput.value =
    place.name;


  await loadLocation({

    lat:
      place.latitude,

    lon:
      place.longitude,

    name:
      place.name,

    country:
      place.country,

    admin:
      place.admin1

  });

}


document.addEventListener(
  "click",
  event => {

    if (
      !event.target.closest(
        ".search-wrap"
      )
    ) {

      searchResults.hidden =
        true;

    }

  }
);