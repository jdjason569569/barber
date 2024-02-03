import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import "./customerTimes.css";
export default function CustomerTimes({ upPopup, showCustomerTimesMethod }) {
  const [customerTimes, setCustomerTimes] = useState([]);

  const apiUrl = process.env.REACT_APP_API;

  useEffect(() => {
    const search = async () => {
      const responseCutomers = await fetch(`${apiUrl}/statistics/usertime`);
      const response = await responseCutomers.json();
      setCustomerTimes(response);
    };
    search();
  }, []);

  const showPoPup = (value) => {
    return showCustomerTimesMethod(value);
  };

  return (
    <>
      <Modal className="content" isOpen={upPopup}>
        <ModalHeader>Clientes y turnos</ModalHeader>
        <ModalBody>
          <div className="times-list-content">
            {customerTimes.map((value) => (
              <div className={"times-container"} key={value.id_customer}>
                <div className="times-text">
                  <h5 className="times-style-name">{value.name}</h5>
                  <p className="text-style-completed">
                    {value.cantidad_turnos_completos}
                  </p>
                </div>
              </div>
            ))}
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
