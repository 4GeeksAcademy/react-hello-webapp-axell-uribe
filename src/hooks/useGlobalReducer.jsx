import React, { createContext, useReducer, useContext } from "react";
import storeReducer, { initialStore } from "../store";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [store, dispatch] = useReducer(storeReducer, initialStore);

  return (
    <StoreContext.Provider value={{ store, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useGlobalReducer = () => useContext(StoreContext);
