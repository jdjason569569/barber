import { useState, useEffect } from "react";
import { auth } from "../../../firebase";
import { Modal, ModalBody } from "reactstrap";
import "./customerTimes.css";
export default function CustomerTimes({
  upPopup,
  showCustomerTimesMethod,
  query,
}) {
  const [customerTimes, setCustomerTimes] = useState([]);
  const [idFirebaseUser, setIdFirebaseUser] = useState(null);
  const apiUrl = process.env.REACT_APP_API;

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user ? setIdFirebaseUser(user.uid) : setIdFirebaseUser(null);
    });
  }, [apiUrl]);

  useEffect(() => {
    const search = async () => {
      const idUser = await getUserById();
      if (idUser !== null) {
        const responseCutomers = await fetch(
          `${apiUrl}/statistics/${query}/${idUser}`
        );
        const response = await responseCutomers.json();
        setCustomerTimes(response);
      }
    };
    switch (query) {
      case "totalPay":
      case "usertime":
      case "moneyByDay":
        search();
        break;
    }
  }, [idFirebaseUser]);

  const showPoPup = (value) => {
    return showCustomerTimesMethod(value);
  };

  const handleMonthChange = async (event) => {
    const idMonth = event.target.value;
    const idUser = await getUserById();
    if (idUser !== null) {
      const responseCutomers = await fetch(
        `${apiUrl}/statistics/${query}/${idUser}/${idMonth}`
      );
      const response = await responseCutomers.json();
      setCustomerTimes(response);
    }
  };

  const getUserById = async () => {
    try {
      const respGetUserById = await fetch(`${apiUrl}/user/${idFirebaseUser}`);
      const response = await respGetUserById.json();
      return response.id_users;
    } catch (error) {
      return null;
    }
  };

  return (
    <>
      <Modal isOpen={upPopup}>
        <ModalBody>
          {(query === "customerGoes" || query === "bestDay") && (
            <div>
              <select id="month" onChange={handleMonthChange}>
                <option value="">Selecciona un mes</option>
                <option value="1">Enero</option>
                <option value="2">Febrero</option>
                <option value="3">Marzo</option>
                <option value="4">Abril</option>
                <option value="5">Mayo</option>
                <option value="6">Junio</option>
                <option value="7">Julio</option>
                <option value="8">Agosto</option>
                <option value="9">Septiembre</option>
                <option value="10">Octubre</option>
                <option value="11">Noviembre</option>
                <option value="12">Diciembre</option>
              </select>
            </div>
          )}
          <div className={`times-list-content ${query}`}>
            {customerTimes.map((value) => {
              switch (query) {
                case "usertime":
                  return (
                    <div className={"times-container"} key={value.id_customer}>
                      <h5 className="times-style-name">{value.name}</h5>
                      <p className="text-style-completed">
                        {value.cantidad_turnos_completos} turnos
                      </p>
                    </div>
                  );
                case "totalPay":
                  return (
                    <div className="text-style-result" key={value.id_users}>
                      En este mes has ganado: {value.total} $
                    </div>
                  );
                case "customerGoes":
                  return (
                    <div className="container-text text-style-result" key={value.id_customer}>
                      {customerTimes.length > 0 && (
                        <div >
                          <h5>{value.name}</h5>
                          <p>{value.citas_completadas} turnos completados en el mes</p>
                        </div>
                      )}
                    </div>
                  );
                case "bestDay":
                  return (
                    <div>
                      {customerTimes.length > 0 && (
                        <div className="text-style-result">
                         El dia {value.dia} ganaste {value.valor_total} $
                        </div>
                      )}
                    </div>
                  );
                case "moneyByDay":
                  return (
                    <div className="text-style-result" key={value.id_users}>
                      {customerTimes.length > 0 && <div>Hoy ganaste {value.total}</div>}
                    </div>
                  );
              }
            })}
          </div>
          <button
            className="btn-sm rounded cancel-turn"
            onMouseDown={() => showPoPup(false)}
          >
            Cerrar
          </button>
        </ModalBody>
      </Modal>
    </>
  );
}
