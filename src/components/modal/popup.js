import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import "../modal/popup.css";



export default function Popup({upPopup}) {
 

  return (
    <>
    <Modal className="content" isOpen={upPopup}>
        <ModalHeader>
            header
        </ModalHeader>
        <ModalBody>
            body
        </ModalBody>
    </Modal>
      
    </>
  );
}
