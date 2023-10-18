import { Modal, ModalBody, ModalHeader } from "reactstrap";
import "../modal/popupAddTurn.css";
import { useState, useEffect } from "react";

export default function PopupAddTurn({ upPopup, addTurn, showPoppupMethod }) {
  const apiUrl = process.env.REACT_APP_API;
  const [input, setInput] = useState({
    id_customer: null,
    name: null,
    phone: null,
    date_register: null,
  });

  const [isEnabledButton, setIsEnabledButton] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [selectCustomer, setSelectCustomer] = useState("");
  const [searchCustomers, setSearchCustomers] = useState([]);
  const [showPopPup, setshowPopPup] = useState(upPopup);

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const responseCutomers = await fetch(`${apiUrl}/customer`);
        const responseCustomersJson = await responseCutomers.json();
        setCustomers(responseCustomersJson);
        setSearchCustomers(responseCustomersJson);
      } catch (error) {
        //console.error(error);
      }
    };
    getCustomers();
  }, [apiUrl]);

  useEffect(() => {
    if (input.name && input.phone && input.date_register) {
      setIsEnabledButton(false);
    } else {
      setIsEnabledButton(true);
    }
  }, [input]);

  const validatePhoneNumber = (phone) => {
    const numeric = /^\d{10}$/;
    return numeric.test(phone) ? true : false;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (input.name !== "" && validatePhoneNumber(input.phone)) {
      addTurn(createTurn(), "turnCustomerSchedule");
      setInput({});
      setIsEnabledButton(true);
    }
  };

  const createTurn = () => {
    return {
      id_customer:selectCustomer.id_customer,
      name: input.name.toLowerCase(),
      phone: input.phone,
      date_register_string: input.date_register
    };
  };

  const handleChange = (event) => {
    const customer = searchCustomerByName(event.target.value);
    setSelectCustomer(customer);
    setInput({
      ...input,
      id_customer: customer.id_customer,
      name: customer.name,
      phone: customer.phone,
    });
  };

  const handleName = (event) => {
    setInput({
      ...input,
      name: event.target.value,
    });
  };
  const handlePhone = (event) => {
    setInput({
      ...input,
      phone: event.target.value,
    });
  };

  const handleDateRegister = (event) => {
    setInput({
      ...input,
      date_register: event.target.value,
    });
  };

  const searchCustomerByName = (name) => {
    return customers.find((customer) => customer.name === name);
  };

  const showPoppup = (value) => {
    return showPoppupMethod(value);
  };

  return (
    <>
      <Modal className="content" isOpen={showPopPup}>
        <ModalHeader>Agregar un horario especifico</ModalHeader>
        <ModalBody>
          <select
            className="form-select form-select-active"
            style={{ marginTop: "2%" }}
            id="menu"
            value={selectCustomer}
            onChange={handleChange}
          >
            <option value=""> Seleccionar Cliente</option>
            {searchCustomers.map((customer) => (
              <option key={customer.id_customer} value={customer.name}>
                {customer.name}
              </option>
            ))}
          </select>
          <form className="turn-form" onSubmit={handleSend}>
            <input
              disabled
              className="turn-input"
              type="text"
              placeholder="Nombre"
              name="texto"
              maxLength="30"
              autoComplete="off"
              value={input.name ?? ""}
              onChange={handleName}
            />
            <input
              disabled
              className="turn-input"
              type="number"
              placeholder="Telefono"
              autoComplete="off"
              value={input.phone ?? ""}
              onChange={handlePhone}
            />
            <input
              className="turn-input"
              type="time"
              value={input.date_register ?? ""}
              onChange={handleDateRegister}
            ></input>
            <button
              hidden={isEnabledButton}
              className="btn-sm rounded create-turn"
            >
              Asignar turno
            </button>
            <button
              className="btn-sm rounded cancel-turn"
              onMouseDown={() => showPoppup(false)}
            >
              Cancelar
            </button>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
}
