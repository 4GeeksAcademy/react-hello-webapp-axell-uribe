import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const Single = () => {
  const { category, uid } = useParams();
  const [details, setDetails] = useState(null);
  const [extraData, setExtraData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://www.swapi.tech/api/${category}/${uid}`);
        const data = await res.json();
        const props = data.result.properties;
        setDetails(props);

        let extras = {};
        if (props.homeworld) {
          const resPlanet = await fetch(props.homeworld);
          const dataPlanet = await resPlanet.json();
          extras.homeworld = dataPlanet.result.properties.name;
        }

        setExtraData(extras);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, [category, uid]);

  if (!details) return <p>Cargando...</p>;

  return (
    <div className="container mt-4">
      <h1>{details.name}</h1>
      <img
        src={`https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/${category}/${uid}.jpg`}
        className="img-fluid mb-3"
        alt={details.name}
        onError={e => (e.target.src = "https://starwars-visualguide.com/assets/img/big-placeholder.jpg")}
      />
      <ul className="list-group">
        {Object.entries(details).map(([key, value]) => {
          if (["starships", "films", "created", "edited", "url"].includes(key)) return null;

          if (key === "homeworld" && extraData.homeworld) {
            return <li key={key} className="list-group-item"><strong>{key.toUpperCase()}:</strong> {extraData.homeworld}</li>;
          }
          return <li key={key} className="list-group-item"><strong>{key.replace("_"," ").toUpperCase()}:</strong> {value}</li>;
        })}
      </ul>
    </div>
  );
};
