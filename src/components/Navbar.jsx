import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalReducer } from "../hooks/useGlobalReducer"; 

const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const [showFavs, setShowFavs] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">SWAPI App</Link>

        <button
          className="btn btn-outline-light"
          onClick={() => setShowFavs(!showFavs)}
        >
          Favoritos: {store.favorites.length}
        </button>

        {showFavs && (
          <div className="dropdown-menu show p-2" style={{ position: "absolute", right: 10, top: 50, minWidth: 250 }}>
            {store.favorites.length === 0 ? (
              <p className="text-center mb-0">No hay favoritos</p>
            ) : (
              store.favorites.map(fav => (
                <div key={`${fav.type}-${fav.uid}`} className="d-flex justify-content-between align-items-center mb-1">
                  <Link to={`/${fav.type}/${fav.uid}`} className="text-decoration-none">{fav.name}</Link>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => dispatch({ type: "REMOVE_FAVORITE", payload: fav })}
                  >
                    ❌
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
