import "../home/home.css";

import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Turn from "../turn/turn";
import { useState } from "react";
import Customer from "../customer/customer";

/**
 * Component that gives input to the application
 */

export default function Home({ name }) {
  const navigate = useNavigate();
  const [option, setOption] = useState("createTurn");

  const exit = () => {
    navigate("/");
    return auth.signOut();
  };

  const changeView = (option)=>{
    setOption(option);
  }

  const componentRender = () => {
    switch (option) {
      case "createTurn":
        return <Turn />;
      case "createCustomer":
        return <Customer/>
        case "seeStats":
          return null;
        default:
            return <Turn />;
    }
  };

  return (
    <>
      <div className="container-home">
        <div>
          <h2>{name ? `Bienvenido  ${name}` : "Inicia session"}</h2>
        </div>
        <div>
          {name && (
            <button className="btn-sm rounded turn-botton" onClick={exit}>
              Salir
            </button>
          )}
        </div>

        <button className="btn-sm rounded turn-botton" onClick={() => changeView('createCustomer')}>
            Crear usuario
          </button>
        
          <button className="btn-sm rounded turn-botton" onClick={() => changeView('createTurn')}>
            Turnos
          </button>
        
          <button className="btn-sm rounded turn-botton" onClick={() => changeView('seeStats')}>
            Ver estadisticas
          </button>
        
          
        
      </div>
      <div>{componentRender()}</div>
    </>
  );
}
