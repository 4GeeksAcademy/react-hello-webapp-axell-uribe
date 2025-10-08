import React from "react";
import { Link } from "react-router-dom";
import FavoritesList from "../components/FavoritesList";

export const Demo = () => {
  return (
    <div className="container mt-4">
      <h2>Favoritos</h2>
      <FavoritesList />
      <Link to="/" className="btn btn-primary mt-3">
        Volver
      </Link>
    </div>
  );
};