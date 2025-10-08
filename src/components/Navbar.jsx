import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useGlobalReducer } from "../hooks/useGlobalReducer";
import FavoritesList from "./FavoritesList";

const Navbar = () => {
  const { store } = useGlobalReducer();
  const [showFavs, setShowFavs] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFavs(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setShowFavs(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark" role="navigation">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Star Wars Blog
        </Link>
        <div className="dropdown">
          <button
            className="btn btn-outline-light dropdown-toggle"
            type="button"
            onClick={() => setShowFavs(!showFavs)}
            aria-expanded={showFavs}
            aria-label="Toggle favorites menu"
          >
            Favoritos: {store.favorites.length}
          </button>
          {showFavs && (
            <div
              ref={dropdownRef}
              className="dropdown-menu show p-2"
              style={{ position: "absolute", right: 10, top: 50, minWidth: 250 }}
            >
              <FavoritesList onClose={() => setShowFavs(false)} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;