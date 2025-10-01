import React from "react";
import { Link } from "react-router-dom";
import { useGlobalReducer } from "../hooks/useGlobalReducer";

export const Demo = () => {
  const { store, dispatch } = useGlobalReducer();
  const removeFavorite = item => dispatch({ type: "REMOVE_FAVORITE", payload: item });

  return (
    <div className="container mt-4">
      <h2>Favoritos</h2>
      {store.favorites.length === 0 ? (
        <p>No tienes favoritos aún</p>
      ) : (
        <ul className="list-group">
          {store.favorites.map(fav => (
            <li key={`${fav.type}-${fav.uid}`} className="list-group-item d-flex justify-content-between align-items-center">
              <Link to={`/${fav.type}/${fav.uid}`} className="text-decoration-none">{fav.name}</Link>
              <button className="btn btn-danger btn-sm" onClick={() => removeFavorite(fav)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
      <Link to="/" className="btn btn-primary mt-3">Volver</Link>
    </div>
  );
};
