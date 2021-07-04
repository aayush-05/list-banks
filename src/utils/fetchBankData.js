import "whatwg-fetch";

const cities = [
  "MUMBAI",
  "DELHI",
  "LUCKNOW",
  "BANGALORE",
  "HYDERABAD",
];

const getAllSearchData = async () => {
  const cache = await caches.open("list-banks");
  const allSearchData= [];

  await Promise.all(cities.map(async (city) => {
    const cachedCityData = await cache.match(`https://vast-shore-74260.herokuapp.com/banks?city=${city}`);
    if (cachedCityData !== undefined) {
      const cachedCityJsonResponse = await cachedCityData.clone().json();
      allSearchData.push(...cachedCityJsonResponse.responseData);
    } else {
      const fetchCityData = await fetchBankData({pathname: "/all-banks"}, city);
      allSearchData.push(...fetchCityData.data);
    }
  }));

  return allSearchData;
};

const fetchBankData = async (locationData, searchQuery) => {
  const cache = await caches.open("list-banks");

  switch(locationData.pathname) {
    case "/all-banks": {
      const currentSearchQuery = searchQuery === undefined ? "MUMBAI" : searchQuery;
      const apiEndpoint = `https://vast-shore-74260.herokuapp.com/banks?city=${currentSearchQuery}`;
      const cachedData = await cache.match(apiEndpoint);

      if (cachedData) {
        const cachedJsonResponse = await cachedData.clone().json();

        if (Math.floor(new Date().getTime()/1000) - cachedJsonResponse.cachedDate < 432000) {
          return {
            status: "success",
            data: cachedJsonResponse.responseData,
          };
        }
      }

      try {
        const response = await fetch(
          apiEndpoint,
          {method: "GET"},
        );

        const jsonResponse = await response.clone().json();

        const customBody = JSON.stringify({
          responseData: jsonResponse,
          cachedDate: Math.floor(new Date().getTime() / 1000),
        });

        const customResponse = new Response(customBody);

        if (customResponse !== undefined) {
          cache.put(apiEndpoint, customResponse);
          return {
            status: "success",
            data: jsonResponse,
          };
        }
      } catch (error) {
        return {
          status: "error",
          data: [],
        };
      }
      break;
    }

    case `/bank-details/${searchQuery}`: {
      const searchData= await getAllSearchData();
      for (const bankData of searchData) {
        if (bankData.ifsc === searchQuery) {
          return {
            status: "success",
            data: bankData,
          };
        }
      }
      return {
        status: "error",
        data: {},
      };
      break;
    }
    
    case "/favorites": {
      const searchData = await getAllSearchData();
      const favoriteBanksData = [];
      const favoriteBanksIfscs = localStorage.getItem("favorite-banks");

      if (favoriteBanksIfscs === null) {
        return {
          status: "success",
          data: [],
        };
      }

      for (const bankData of searchData) {
        if (favoriteBanksIfscs.includes(bankData.ifsc)) {
          favoriteBanksData.push(bankData);
        }
      }

      return {
        status: "success",
        data: favoriteBanksData,
      }
    }

    default:
      return;
  }
};

export default fetchBankData;
