import { Modal, ModalBody } from "reactstrap";
import "./popupCancel.css";
export default function PopupCancel({ upPopup, showCustomerTimesMethod }) {
  const showPoPup = (value) => {
    return showCustomerTimesMethod(value);
  };

  return (
    <>
      <Modal isOpen={upPopup}>
        <ModalBody>
            <p className="text-style-cancel">¿Quiere cerrar sesion?</p>
          <button
            className="btn-sm rounded ok-popup"
            onMouseDown={() => showPoPup(true)}
          >
            Si
          </button>
          <button
            className="btn-sm rounded cancel-turn"
            onMouseDown={() => showPoPup(false)}
          >
            No
          </button>
        </ModalBody>
      </Modal>
    </>
  );
}
