import React from "react";
import { Link } from "react-router-dom";
import { useGlobalReducer } from "../hooks/useGlobalReducer";

const FavoritesList = ({ onClose }) => {
  const { store, dispatch } = useGlobalReducer();
  const favorites = store.favorites || [];

  return (
    <div className="p-2">
      {favorites.length === 0 ? (
        <p className="text-center mb-0">No hay favoritos. ¡Agrega algunos!</p>
      ) : (
        <ul className="list-group">
          {favorites.map((fav) => (
            <li
              key={`${fav.type}-${fav.uid}`}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <Link
                to={`/${fav.type}/${fav.uid}`}
                className="text-decoration-none"
                onClick={onClose}
              >
                {fav.name}
              </Link>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => dispatch({ type: "REMOVE_FAVORITE", payload: fav })}
                aria-label={`Eliminar ${fav.name} de favoritos`}
              >
                ❌
              </button>
            </li>
          ))}
          <button
            className="btn btn-sm btn-warning w-100 mt-2"
            onClick={() => dispatch({ type: "CLEAR_FAVORITES" })}
            disabled={favorites.length === 0}
          >
            Limpiar todos
          </button>
        </ul>
      )}
    </div>
  );
};

export default FavoritesList;