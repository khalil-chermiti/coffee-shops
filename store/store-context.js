import { createContext, useReducer } from "react";

export const StoresContext = createContext();
StoresContext.displayName = "StoresContext";

export const ACTION_TYPES = {
  SET_COORDINTES: "SET_COORDINTES",
  SET_STORES: "SET_STORES",
};

const storeReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_COORDINTES: {
      return { ...state, coordinates: action.payload };
    }
    case ACTION_TYPES.SET_STORES: {
      return { ...state, coffeeStores: action.payload };
    }
    default:
      throw new Error(`unhandled action type : ${action.type}`);
  }
};

export const StoreProvider = ({ children }) => {
  const initialState = {
    coordinates: "",
    coffeeStores: [],
  };

  const [state, dispatch] = useReducer(storeReducer, initialState);

  return (
    <StoresContext.Provider value={{ state, dispatch }}>
      {children}
    </StoresContext.Provider>
  );
};
