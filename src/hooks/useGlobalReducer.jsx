import React, { createContext, useReducer, useContext, useEffect } from "react";
import storeReducer, { initialStore } from "../store";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [store, dispatch] = useReducer(storeReducer, {
    ...initialStore,
    favorites: JSON.parse(localStorage.getItem("favorites")) || initialStore.favorites,
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(store.favorites));
  }, [store.favorites]);

  return (
    <StoreContext.Provider value={{ store, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useGlobalReducer = () => useContext(StoreContext);