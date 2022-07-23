import { createApi } from "unsplash-js";

// foursquare http header options
const FSQ_OPTIONS = {
  method: "GET",
  headers: {
    Accept: "application/json",
    Authorization: process.env.NEXT_PUBLIC_API_KEY,
  },
};

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_PUB,
});

// ! fetch images from unsplash
const fetchCoffeeStoreImage = async (count = 6) => {
  const data = await unsplash.search.getPhotos({
    query: "coffeeshop",
    perPage: count,
    page: 1,
    orientation: "landscape",
  });
  console.log("images response" ,data.response.results)
  return data.response.results.map(result => result.urls.small);
};

// ! fetch coffee stores data from foursquare api
const fetchCoffeStoresData = async (ll = "35.89404,10.59347", limit = 6) => {
  // adding an image to each store object
  try {
    const images = await fetchCoffeeStoreImage();
    console.log('images : ' , images)
    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?query=coffee&ll=${ll}&limit=${limit}`,
      FSQ_OPTIONS
    );
    const coffeeStores = await response.json();
    
    console.log(coffeeStores)
    const fileteredCoffeeStoresData = coffeeStores.results.map(
      (store, index) => ({
        id: store.fsq_id,
        name: store.name,
        imgUrl: images[index],
        address: store.location.address || "not available",
        neighbourhood: store.location.neighborhood || "not available",
      })
    );

    return fileteredCoffeeStoresData;
  } catch (err) {
    console.log("failed to fetch coffee stores data", err);
    return null;
  }
};

// fetch specific store data and add an image from unsplash
export const fetchCoffeeStore = async id => {
  const data = await fetch(
    `https://api.foursquare.com/v3/places/${id}`,
    FSQ_OPTIONS
  );
  let store = await data.json();

  // fetching one image url
  const image = await fetchCoffeeStoreImage(1);

  return {
    id: store.fsq_id,
    name: store.name,
    imgUrl: image[0],
    address: store.location.address || "not available",
    neighbourhood: store.location.neighborhood || "not available",
  };
};

export default fetchCoffeStoresData;
