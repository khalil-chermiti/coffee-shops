import { useContext , useEffect , useState } from "react";
import { StoresContext } from "../../store/store-context";

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";

import styles from "../../styles/coffe-store.module.css";
import 
  fetchCoffeStoresData, 
  { fetchCoffeeStore } 
from "../../lib/coffee-store";
import useSWR from "swr";

const CoffeeStore = ({ coffeeStore , storeId}) => {

  let {state} = useContext(StoresContext);
  const [votingCount , setVotingCount] = useState(1);
  let [storeToRender , setStoreToRender] = useState(null);
  const { name, address, neighbourhood, imgUrl } = storeToRender || {};
  
  // revalidating data on tab focus change
  const {data , error} = useSWR(
    `/api/getCoffeeStoreById?id=${storeId}` ,
    {revalidateOnFocus : true}
  );

  //saving the store to airtable db
  const handleStoreCreation = async (store) => {
    const { id , name, address, neighbourhood, imgUrl } = store ;
    try {
      await fetch(
        '/api/createCoffeeStore',
        { 
          Headers : {"Content-type" : "application/json"},
          method : "POST" ,
          body : JSON.stringify({
            id , 
            name , 
            imgUrl ,
            vote : 0,
            address : address || '' , 
            neighbourhood : neighbourhood[0] || '' ,
          })
        }
      );
    } catch(err) {
      console.log(err);
    }
  }  

  // incrementing upvote
  const handleUpvoteButton = async () => {
    try {
      // update count in airtable
      const response = await fetch(
        '/api/favouriteCoffeeStoreById',
        { 
          Headers : {"Content-type" : "application/json"},
          method : "PUT" ,
          body : JSON.stringify({id : storeId})
        }
      );
      
      let dbCoffeeStore = await response.json() ;

      // update count locally
      if(dbCoffeeStore?.length !== 0) {
        let count = votingCount ;
        setVotingCount(count + 1) ;
      }
    } catch(err) {
      console.log('error upadating vote : ' , err);
    }
 
  }

  // chose to fetch store data from context or from staticProps 
  useEffect(() => {
    // find store in context
    let foundContextStore = state.coffeeStores.find(store => store.id === storeId) ;
    
    if(foundContextStore) {
      // save store data to airtable database
      handleStoreCreation(foundContextStore);
      setStoreToRender(foundContextStore);
      setVotingCount(foundContextStore.vote);
    } else {
      handleStoreCreation(coffeeStore);
      setStoreToRender(coffeeStore);
      setVotingCount(coffeeStore.vote);
    }
  } , [storeId]) ;

  // revalidating data using swr
  useEffect(() => {
    if(Array.isArray(data)){
      console.log("setting new data : " , data);
      setStoreToRender(data[0]);
      setVotingCount(data[0]?.vote);
    }
  } , [data]) ;

  return storeToRender
    ? <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>Back Home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <div className={styles.storeImgWrapper}>
            <Image
              src={imgUrl}
              width={400}
              height={300}
              className={styles.storeImg}
              alt={name}
            />
          </div>
        </div>

        <div className={classNames("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/dropPin.svg"
              width={24}
              height={24}
              alt="address icon"
            />
            <p className={styles.text}>{address}</p>
          </div>

          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/nearMe.svg"
              width={24}
              height={24}
              alt="neighbourhood icon"
            />
            <p className={styles.text}>{neighbourhood}</p>
          </div>

          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width={24}
              height={24}
              alt="votes icon"
            />
            <p className={styles.text}>{votingCount ? votingCount : 0}</p>
          </div>

          <button 
            className={styles.upvoteButton}
            onClick={handleUpvoteButton}
          >Upvote</button>
        </div>
      </div>
      </div>
    : <h1>loading store data...!</h1>
};

  


// getting static props for each page
export const getStaticProps = async context => {
  const coffeeStore = await fetchCoffeeStore(context.params.storeId);

  return {
    props: { 
      coffeeStore ,
      storeId : context.params.storeId,
     },
  };
};




// generating static pages
export const getStaticPaths = async () => {
  const coffeeStores = await fetchCoffeStoresData();
  const paths = coffeeStores?.map(store => {
    return {
      params: { storeId: store.id.toString() },
    };
  });

  return {
    paths: paths,
    fallback: true,
  };
};

export default CoffeeStore;
