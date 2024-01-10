import { auth } from "../../firebase";

import { Modal, ModalBody, ModalHeader } from "reactstrap";
import "../modal/popupAddTurn.css";
import { useState, useEffect } from "react";

export default function PopupAddTurn({ upPopup, addTurn, showPoppupMethod, listTurns}) {
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
  const [idFirebaseUser, setIdFirebaseUser] = useState(null);
  const [inputValueSearch, setInputValueSearch] = useState("");
  const [turns, setTurns] = useState(listTurns);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user ? setIdFirebaseUser(user.uid) : setIdFirebaseUser(null);
    });
  }, [apiUrl]);

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const idUser = await getUserById();
        if (idUser) {
          const responseCutomers = await fetch(
            `${apiUrl}/customer/byuser/${idUser}`
          );
          const responseCustomersJson = await responseCutomers.json();
          setCustomers(responseCustomersJson);
          setSearchCustomers(responseCustomersJson);
        }
      } catch (error) {
        //console.error(error);
      }
    };
    getCustomers();
  }, [idFirebaseUser, apiUrl]);

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
      const customer = customers.find((customer) => {
        return customer.name === input.name;
      });
      const isValid = turns.find((turn) => {
        return turn.customer.phone === customer.phone;
      });
      if (!isValid) {
        addTurn(createTurn(), "turnCustomerSchedule");
        setInput({});
        setIsEnabledButton(true);
      } 
      // else {
      //   toast.warning("Ya existe un turno para este cliente", {
      //     autoClose: 5000,
      //     position: toast.POSITION.TOP_CENTER,
      //   });
      // }
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

  const createTurn = () => {
    return {
      id_customer: selectCustomer.id_customer,
      name: input.name.toLowerCase(),
      phone: input.phone,
      date_register_string: input.date_register,
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

  const handleInputChange = (event) => {
    setInputValueSearch(event.target.value.toLowerCase());
    const resultadosFiltrados = customers.filter((customer) =>
      customer.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSearchCustomers(resultadosFiltrados);
  };

  return (
    <>
      <Modal className="content" isOpen={upPopup}>
        <ModalHeader>Agregar un horario especifico</ModalHeader>
        <ModalBody>
          <div className="input-group">
            <span className="title-client">Buscar cliente</span>
            <input
              type="text"
              value={inputValueSearch}
              onChange={handleInputChange}
              aria-label="First name"
              className="form-control"
            />
          </div>
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
