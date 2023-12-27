import { Modal, ModalBody, ModalHeader } from "reactstrap";
import "../modal/popupCardInformation.css";


export default function PopupCardInformation({ upPopup, showPoppupMethodInfo }) {



  const showPoppup = (value) => {
    return showPoppupMethodInfo(value);
  };

  return (
    <>
      <Modal className="content" isOpen={upPopup}>
        <ModalHeader>Informacion de las citas</ModalHeader>
        <ModalBody>
          <div className="content">
            <div className="icon-avaliable"></div>
            <div className="information">Cita disponible</div>
          </div>
          <div className="content">
            <div className="icon-scheduled"></div>
            <div className="information">Cita creada manualmente</div>
          </div>
          <div className="content">
            <div className="icon-completed"></div>
            <div className="information">Cita atendida</div>
          </div>
        <button
              className="btn-sm rounded cancel-turn"
              onMouseDown={() => showPoppup(false)}
            >
              Cerrar
            </button>
        </ModalBody>
      </Modal>
    </>
  );
}
