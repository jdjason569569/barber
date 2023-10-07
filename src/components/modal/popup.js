import { Modal, ModalBody, ModalHeader } from "reactstrap";
import "../modal/popup.css";
import Formturn from "../turn/formTurn/formTurn";



export default function Popup({upPopup}) {
 

  return (
    <>
    <Modal className="content" isOpen={upPopup}>
        <ModalHeader>
            header
        </ModalHeader>
        <ModalBody>
        <Formturn  schedule={false}></Formturn>
        </ModalBody>
    </Modal>
      
    </>
  );
}
