import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

export default function PopupCreateTurn  ({ upPopup, addTurn, showPoppupMethod, customer }) {
    const apiUrl = process.env.REACT_APP_API;
    
  
    
    
  
    
    return (
      <>
        <Modal className="content" isOpen={upPopup}>
          <ModalHeader>Crear turno</ModalHeader>
          <ModalBody>
            {customer}
            
          </ModalBody>
        </Modal>
      </>
    );
  }