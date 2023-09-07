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

  const changeView = (option) => {
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
      default:
        return <Turn />;
    }
  };

  return (
    <>
      <div className="container-home">
        <div>
          <h4>{name ? `Bienvenido  ${name}` : "Inicia session"}</h4>
        </div>
        <div className="container-options">
          <span
            className="material-symbols-rounded turn-botton"
            onClick={() => changeView("createCustomer")}
          >
            add
          </span>
          <span
            className="material-symbols-rounded turn-botton"
            onClick={() => changeView("createTurn")}
          >
            assignment_turned_in
          </span>
          <span
            className="material-symbols-rounded turn-botton"
            onClick={() => changeView("seeStats")}
          >
            query_stats
          </span>
          {name && (
            <span className="material-symbols-rounded turn-botton" onClick={exit}>
              exit_to_app
            </span>
          )}
        </div>
      </div>
      <div className="container-render">{componentRender()}</div>
    </>
  );
}
