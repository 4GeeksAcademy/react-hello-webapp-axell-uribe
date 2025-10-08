import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalReducer } from "../hooks/useGlobalReducer";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      const cachedData = JSON.parse(localStorage.getItem("swapiData"));
      if (cachedData) {
        console.log("Usando datos en caché:", cachedData);
        dispatch({ type: "SET_PEOPLE", payload: cachedData.people });
        dispatch({ type: "SET_PLANETS", payload: cachedData.planets });
        dispatch({ type: "SET_VEHICLES", payload: cachedData.vehicles });
        setLoading(false);
        return;
      }

      const [peopleRes, planetsRes, vehiclesRes] = await Promise.all([
        fetch("https://www.swapi.tech/api/people"),
        fetch("https://www.swapi.tech/api/planets"),
        fetch("https://www.swapi.tech/api/vehicles"),
      ]);

      if (!peopleRes.ok || !planetsRes.ok || !vehiclesRes.ok) {
        throw new Error("No se pudieron cargar los datos");
      }

      const peopleData = await peopleRes.json();
      const planetsData = await planetsRes.json();
      const vehiclesData = await vehiclesRes.json();

      
      const people = peopleData.results.map((p) => ({
        ...p,
        type: "people",
        uid: parseInt(p.uid, 10).toString(),
      }));
      const planets = planetsData.results.map((p) => ({
        ...p,
        type: "planets",
        uid: parseInt(p.uid, 10).toString(),
      }));
      const vehicles = vehiclesData.results.map((v) => ({
        ...v,
        type: "vehicles",
        uid: parseInt(v.uid, 10).toString(),
      }));

      console.log("Datos obtenidos:", { people, planets, vehicles });

      dispatch({ type: "SET_PEOPLE", payload: people });
      dispatch({ type: "SET_PLANETS", payload: planets });
      dispatch({ type: "SET_VEHICLES", payload: vehicles });

      localStorage.setItem("swapiData", JSON.stringify({ people, planets, vehicles }));
      setLoading(false);
    } catch (err) {
      console.error("Error en fetch:", err);
      setError("No se pudieron cargar los datos. Intenta de nuevo.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getImageCategory = (type) => {
    if (type === "people") return "characters";
    if (type === "vehicles") return "starships";
    return type;
  };

  const renderCard = (item) => {
    const isFavorite = store.favorites.find(
      (f) => f.uid === item.uid && f.type === item.type
    );
    const imageUrl = `https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/${getImageCategory(item.type)}/${item.uid}.jpg`;
    console.log("Renderizando tarjeta para:", item.name, "URL de imagen:", imageUrl, "UID:", item.uid);

    return (
      <div key={item.uid} className="card m-2 p-2" style={{ width: "14rem" }}>
        <img
          src={imageUrl}
          className="card-img-top"
          alt={`Imagen de ${item.name}`}
          loading="lazy"
          onError={(e) => {
            console.log(`Error al cargar imagen: ${imageUrl}`);
            e.target.src = "https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/placeholder.jpg";
          }}
        />
        <div className="card-body">
          <h5 className="card-title">{item.name}</h5>
          <Link
            to={`/${item.type}/${item.uid}`}
            className="btn btn-primary btn-sm me-2"
          >
            Ver
          </Link>
          <button
            className={`btn btn-sm ${isFavorite ? "btn-danger" : "btn-outline-danger"}`}
            onClick={() =>
              dispatch({
                type: isFavorite ? "REMOVE_FAVORITE" : "ADD_FAVORITE",
                payload: item,
              })
            }
            aria-label={isFavorite ? `Eliminar ${item.name} de favoritos` : `Añadir ${item.name} a favoritos`}
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>
      </div>
    );
  };

  if (error) {
    console.log("Estado de error:", error);
    return <p className="text-center text-danger mt-5">{error}</p>;
  }
  if (loading) {
    console.log("Estado de carga:", loading);
    return <div className="text-center mt-5"><div className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div></div>;
  }

  return (
    <div className="container mt-4">
      <h2>Personajes</h2>
      <div className="d-flex flex-wrap">{store.people.map(renderCard)}</div>

      <h2>Naves</h2>
      <div className="d-flex flex-wrap">{store.vehicles.map(renderCard)}</div>

      <h2>Planetas</h2>
      <div className="d-flex flex-wrap">{store.planets.map(renderCard)}</div>
    </div>
  );
};