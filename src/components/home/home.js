import "../home/home.css";

import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Turn from "../turn/turn";
import { useState } from "react";
import Customer from "../customer/customer";
import TurnSchedule from "../turnSchedule/turnSchedule";

/**
 * Component that gives input to the application
 */

export default function Home({ name }) {
  const navigate = useNavigate();
  const [option, setOption] = useState("createTurn");
  const [turn, setTurn] = useState(true);
  const [customer, setCustomer] = useState(false);
  const [stats, setStats] = useState(false);
  const [turnSchedule, setTurnSchedule] = useState(false);
  const [config, setConfig] = useState(false);
  const [title, setTitle] = useState("Gestion de Turnos");

  const exit = () => {
    navigate("/");
    return auth.signOut();
  };

  const changeView = (option) => {
    switch (option) {
      case "createTurn":
        setTitle("Gestion de Turnos");
        setTurn(true);
        setCustomer(false);
        setStats(false);
        setTurnSchedule(false);
        setConfig(false);
        break;
      case "createCustomer":
        setTitle("Clientes");
        setTurn(false);
        setCustomer(true);
        setStats(false);
        setTurnSchedule(false);
        setConfig(false);
        break;
      case "seeStats":
        setTitle("Estadisticas");
        setTurn(false);
        setCustomer(false);
        setStats(true);
        setTurnSchedule(false);
        setConfig(false);
        break;
      case "turnSchedule":
        setTitle("Calendario de turnos");
        setTurn(false);
        setCustomer(false);
        setStats(false);
        setTurnSchedule(true);
        setConfig(false);
        break;
      case "config":
        setTitle("Configuracion");
        setTurn(false);
        setCustomer(false);
        setStats(false);
        setTurnSchedule(false);
        setConfig(true);
        break;
    }
    setOption(option);
  };

  const componentRender = () => {
    switch (option) {
      case "createTurn":
        return <Turn />;
      case "createCustomer":
        return <Customer />;
      case "seeStats":
        return null;
      case "turnSchedule":
        return <TurnSchedule/>;
      case "config":
        return null;
      default:
        return <Turn />;
    }
  };

  return (
    <>
      <div className="container-home">
        <div className="container-options">
          <span
            className={`material-symbols-rounded ${
              customer ? "turn-botton turn-botton-selected" : "turn-botton"
            }`}
            onClick={() => changeView("createCustomer")}
          >
            add
          </span>
          <span
            className={`material-symbols-rounded ${
              turn ? "turn-botton turn-botton-selected" : "turn-botton"
            }`}
            onClick={() => changeView("createTurn")}
          >
            assignment_turned_in
          </span>
          <span
            className={`material-symbols-rounded ${
              stats ? "turn-botton turn-botton-selected" : "turn-botton"
            }`}
            onClick={() => changeView("seeStats")}
          >
            query_stats
          </span>
          <span
            className={`material-symbols-rounded ${
              turnSchedule ? "turn-botton turn-botton-selected" : "turn-botton"
            }`}
            onClick={() => changeView("turnSchedule")}
          >
            calendar_month
          </span>
          <span
            className={`material-symbols-rounded ${
              config ? "turn-botton turn-botton-selected" : "turn-botton"
            }`}
            onClick={() => changeView("config")}
          >
            settings
          </span>
          {name && (
            <span
              className="material-symbols-rounded turn-botton"
              onClick={exit}
            >
              exit_to_app
            </span>
          )}
        </div>
        <div className="style-text-title">{title}</div>
      </div>
      <div className="container-render">{componentRender()}</div>
    </>
  );
}
