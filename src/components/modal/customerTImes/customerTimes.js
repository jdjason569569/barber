import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

export default function CustomerTimes({ upPopup, showCustomerTimesMethod }) {
  const [a, setA] = useState([]);

  const apiUrl = process.env.REACT_APP_API;

  useEffect(() => {
    const search = async () => {
      const responseCutomers = await fetch(`${apiUrl}/statistics/usertime`);
      const response = await responseCutomers.json();
      setA(response);
    };
    search();
  }, []);

  const showPoPup = (value) => {
    return showCustomerTimesMethod(value);
  };

  return (
    <>
      <Modal className="content" isOpen={upPopup}>
        <ModalHeader>Agregar un horario especifico</ModalHeader>
        <ModalBody>
          <form>
            {a.map((a) => (
              <div key={a.id_customer}>
                <p>Nombre: {a.name}</p>
                <p>turnos completos: {a.cantidad_turnos_completos}</p>
              </div>
            ))}
            <button
              className="btn-sm rounded cancel-turn"
              onMouseDown={() => showPoPup(false)}
            >
              Cancelar
            </button>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
}
