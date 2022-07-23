import Head from "next/head";
import Card from "../components/Card";
import Banner from "../components/banner";
import styles from "../styles/Home.module.css";
import useGeolocation from "../hooks/useGeolocation";
import fetchCoffeStoresData from "../lib/coffee-store";

import { useEffect, useState, useContext } from "react";
import { StoresContext, ACTION_TYPES } from "../store/store-context";

export default function Home(props) {
  const { coordinates, loading, setLoading, getCoordinates } = useGeolocation();
  const { dispatch, state } = useContext(StoresContext);

  // get new location from browser navigation api
  const handleBannerClick = () => {
    getCoordinates();
  };

  // fetch new data on location change
  useEffect(() => {
    console.log(`${coordinates.lat},${coordinates.long}`);
    const stores = async () => {
      try {
        let stores = await fetch(
          "http://localhost:3000/api/getCoffeeStores?latLong=40.72891,-74.18912&limit=6"
        );

        stores = await stores.json();

        dispatch({
          type: ACTION_TYPES.SET_STORES,
          payload: stores,
        });
      } catch (err) {
        alert("error fetching coffee shops data for your location");
      }

      setLoading(false);
    };
    stores();
  }, [coordinates]);

  return (
    <div className={styles.container}>
      <Head>
        <title>coffee connouseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={loading ? "loading...." : "View stores nearby!"}
          handleClick={handleBannerClick}
        />

        {state?.coffeeStores.length > 0 ? (
          <div className={styles.cardLayout}>
            {state.coffeeStores.map(store => (
              <Card
                key={store.id}
                name={store.name}
                imgUrl={store.imgUrl}
                href={`/coffee-store/${store.id}`}
              />
            ))}
          </div>
        ) : (
          <div className={styles.cardLayout}>
            {props.coffeeStores.map(store => (
              <Card
                key={store.id}
                name={store.name}
                imgUrl={store.imgUrl}
                href={`/coffee-store/${store.id}`}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export const getStaticProps = async context => {
  const coffeeStores = await fetchCoffeStoresData();

  return {
    props: {
      coffeeStores,
    },
  };
};
