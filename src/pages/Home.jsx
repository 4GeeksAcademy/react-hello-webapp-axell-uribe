import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalReducer } from "../hooks/useGlobalReducer"; 

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [peopleRes, planetsRes, vehiclesRes] = await Promise.all([
        fetch("https://www.swapi.tech/api/people"),
        fetch("https://www.swapi.tech/api/planets"),
        fetch("https://www.swapi.tech/api/vehicles"),
      ]);

      const peopleData = await peopleRes.json();
      const planetsData = await planetsRes.json();
      const vehiclesData = await vehiclesRes.json();

      const people = peopleData.results.slice(0, 10).map(p => ({ ...p, type: "people" }));
      const planets = planetsData.results.slice(0, 10).map(p => ({ ...p, type: "planets" }));
      const vehicles = vehiclesData.results.slice(0, 10).map(v => ({ ...v, type: "vehicles" }));

      dispatch({ type: "SET_PEOPLE", payload: people });
      dispatch({ type: "SET_PLANETS", payload: planets });
      dispatch({ type: "SET_VEHICLES", payload: vehicles });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const renderCard = (item) => {
    const isFavorite = store.favorites.find(f => f.uid === item.uid && f.type === item.type);

    return (
      <div key={item.uid} className="card m-2 p-2" style={{ width: "14rem" }}>
        <img
          src={`https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/${item.type}/${item.uid}.jpg`}
          className="card-img-top"
          alt={item.name}
          onError={e => (e.target.src = "https://starwars-visualguide.com/assets/img/big-placeholder.jpg")}
        />
        <div className="card-body">
          <h5 className="card-title">{item.name}</h5>
          <Link to={`/${item.type}/${item.uid}`} className="btn btn-primary btn-sm me-2">Ver</Link>
          <button
            className={`btn btn-sm ${isFavorite ? "btn-danger" : "btn-outline-danger"}`}
            onClick={() => dispatch({ type: isFavorite ? "REMOVE_FAVORITE" : "ADD_FAVORITE", payload: item })}
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <p className="text-center mt-5">Cargando...</p>;

  return (
    <div className="container mt-4">
      <h2>Personajes</h2>
      <div className="d-flex flex-wrap">{store.people.map(renderCard)}</div>

      <h2>Vehículos</h2>
      <div className="d-flex flex-wrap">{store.vehicles.map(renderCard)}</div>

      <h2>Planetas</h2>
      <div className="d-flex flex-wrap">{store.planets.map(renderCard)}</div>
    </div>
  );
};
