import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGlobalReducer } from "../hooks/useGlobalReducer";

export const Single = () => {
  const { category, uid } = useParams();
  const { store, dispatch } = useGlobalReducer();
  const [details, setDetails] = useState(null);
  const [extraData, setExtraData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Obteniendo detalles para:", { category, uid });
        setError(null);
        const res = await fetch(`https://www.swapi.tech/api/${category}/${uid}`);
        if (!res.ok) throw new Error("No se pudieron cargar los detalles");
        const data = await res.json();
        const props = data.result.properties;
        setDetails({ ...props, uid: parseInt(data.result.uid, 10).toString() });

        let extras = {};
        if (props.homeworld) {
          const resPlanet = await fetch(props.homeworld);
          if (!resPlanet.ok) throw new Error("No se pudo cargar el planeta");
          const dataPlanet = await resPlanet.json();
          extras.homeworld = dataPlanet.result.properties.name;
        }

        setExtraData(extras);
      } catch (err) {
        console.error("Error en fetch:", err);
        setError("No se pudieron cargar los detalles. Intenta de nuevo.");
      }
    };
    fetchData();
  }, [category, uid]);

  const getImageCategory = (cat) => {
    if (cat === "people") return "characters";
    if (cat === "vehicles") return "starships";
    return cat;
  };

  const isFavorite = store.favorites.find(
    (f) => f.uid === uid && f.type === category
  );

  if (error) {
    console.log("Estado de error:", error);
    return <p className="text-center text-danger mt-5">{error}</p>;
  }
  if (!details) {
    console.log("Sin detalles aún:", { details });
    return <div className="text-center mt-5"><div className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div></div>;
  }

  const imageUrl = `https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/${getImageCategory(category)}/${uid}.jpg`;
  console.log("Renderizando imagen para:", details.name, "URL de imagen:", imageUrl, "UID:", uid);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>{details.name}</h1>
        <button
          className={`btn btn-sm ${isFavorite ? "btn-danger" : "btn-outline-danger"}`}
          onClick={() =>
            dispatch({
              type: isFavorite ? "REMOVE_FAVORITE" : "ADD_FAVORITE",
              payload: { uid, name: details.name, type: category },
            })
          }
          aria-label={isFavorite ? `Eliminar ${details.name} de favoritos` : `Añadir ${details.name} a favoritos`}
        >
          {isFavorite ? "❤️ Eliminar Favorito" : "🤍 Añadir Favorito"}
        </button>
      </div>
      <img
        src={imageUrl}
        className="img-fluid mb-3"
        alt={`Imagen de ${details.name}`}
        loading="lazy"
        onError={(e) => {
          console.log(`Error al cargar imagen: ${imageUrl}`);
          e.target.src = "https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/placeholder.jpg";
        }}
      />
      <ul className="list-group">
        {Object.entries(details).map(([key, value]) => {
          if (["starships", "films", "created", "edited", "url"].includes(key))
            return null;

          if (key === "homeworld" && extraData.homeworld) {
            return (
              <li key={key} className="list-group-item">
                <strong>{key.replace("_", " ").toUpperCase()}:</strong> {extraData.homeworld}
              </li>
            );
          }
          return (
            <li key={key} className="list-group-item">
              <strong>{key.replace("_", " ").toUpperCase()}:</strong> {Array.isArray(value) ? value.join(", ") : value}
            </li>
          );
        })}
      </ul>
      <Link to="/" className="btn btn-primary mt-3">
        Volver
      </Link>
    </div>
  );
};