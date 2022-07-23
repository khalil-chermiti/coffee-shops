import { useState } from "react";
import { useContext } from "react";
import { StoresContext, ACTION_TYPES } from "../store/store-context";

export default function useGeolocation() {
  const { dispatch } = useContext(StoresContext);

  const [coordinates, setCoordinates] = useState({
    lat: 0,
    long: 0,
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const error = () => {
    setCoordinates({ lat: 0, long: 0 });
    dispatch({
      type: ACTION_TYPES.SET_COORDINTES,
      payload: "0,0",
    });
    setLoading(false);
    setErr("error getting your coordinates :(");
  };

  const success = position => {
    setCoordinates({
      lat: position.coords.latitude,
      long: position.coords.longitude,
    });
    dispatch({
      type: ACTION_TYPES.SET_COORDINTES,
      payload: `${position.coords.latitude},${position.coords.longitude}`,
    });

    setErr(null);
    // setLoading(false);
  };

  const getCoordinates = () => {
    setLoading(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    getCoordinates,
    setLoading,
    coordinates,
    loading,
    err,
  };
}
