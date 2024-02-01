import { useState } from "react";

import "./statistics.css";
const apiUrl = process.env.REACT_APP_API;

export default function Statistics() {
  //const [userTime, setUserTime] = useState(0);
  const [a, setA] = useState([]);

  const search = async () => {
    const responseCutomers = await fetch(`${apiUrl}/statistics/usertime`);
    const response = await responseCutomers.json();
    setA(response);
  };

  return (
    <>
      <div>
        <button className="btn-sm rounded cancel-turn" onClick={() => search()}>
          Consultar
        </button>
        {a.map((a) => (
          <div key={a.id}>
             <p>ID: {a.id}</p>
             <p>Nombre: {a.date_register}</p>
          </div>
        ))}
      </div>
    </>
  );
}
