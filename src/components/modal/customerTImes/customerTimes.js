import { useState, useEffect } from "react";
import { auth } from "../../../firebase";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
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
        search();
        break;
    }
  }, [idFirebaseUser]);

  const showPoPup = (value) => {
    return showCustomerTimesMethod(value);
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
      <Modal className="content" isOpen={upPopup}>
        <ModalHeader>Clientes y turnos</ModalHeader>
        <ModalBody>
          <div className="times-list-content">
            {customerTimes.map((value) => {
              switch (query) {
                case "usertime":
                  return (
                    <div className={"times-container"} key={value.id_customer}>
                      <div className="times-text">
                        <h5 className="times-style-name">{value.name}</h5>
                        <p className="text-style-completed">
                          {value.cantidad_turnos_completos}
                        </p>
                      </div>
                    </div>
                  )
                  case "totalPay":
                  return (
                    <div> {value.total}</div>
                  )
                  
              }
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            className="btn-sm rounded cancel-turn"
            onMouseDown={() => showPoPup(false)}
          >
            Ok
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
}
