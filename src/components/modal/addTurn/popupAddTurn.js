import { Modal, ModalBody, ModalHeader } from "reactstrap";
import "../addTurn/popupAddTurn.css";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function PopupAddTurn({
  upPopup,
  addTurn,
  showPoppupMethod,
  listTurns,
  listCustomers,
  turn,
}) {
  const [input, setInput] = useState({
    id_customer: null,
    name: null,
    phone: null,
    price: null,
    date_register: null,
  });

  const [isEnabledButton, setIsEnabledButton] = useState(true);
  const [selectCustomer, setSelectCustomer] = useState("");
  const [inputValueSearch, setInputValueSearch] = useState("");
  const turns = listTurns;
  const customers = listCustomers;
  const [searchCustomers, setSearchCustomers] = useState(listCustomers);
  const invited = JSON.parse(localStorage.getItem('invited'));

  useEffect(() => {
    if (turn && turn.customer.name) {
      setInput({
        id_customer: turn.customer.id_customer,
        name: turn.customer.name,
        phone: turn.customer.phone,
        price: turn.price,
        date_register: manageDateRegister(turn.date_register),
      });
    }
  }, [turn]);

  useEffect(() => {
    if (input.name && input.phone && input.date_register && input.price) {
      setIsEnabledButton(false);
    } else {
      setIsEnabledButton(true);
    }
  }, [input]);

  const validatePhoneNumber = (phone) => {
    const numeric = /^\d{10}$/;
    return numeric.test(phone) ? true : false;
  };

  const manageDateRegister = (dateRegister) => {
    let currentDate = new Date(dateRegister);
    let hours = 0;
    let minutes = 0;
    if (process.env.REACT_APP_ZONE === "0") {
      hours = currentDate.getUTCHours();
      minutes = currentDate.getUTCMinutes();
    } else {
      hours = currentDate.getHours();
      minutes = currentDate.getMinutes();
    }

    return (
      hours.toString().padStart(2, "0") +
      ":" +
      minutes.toString().padStart(2, "0")
    );
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (turn && turn.customer.id_customer) {
      if (input.name !== "" && validatePhoneNumber(input.phone)) {
        addTurn(createTurn(), "turnCustomerSchedule");
        setInput({});
        setIsEnabledButton(true);
      }
    } else {
      if (input.name !== "" && validatePhoneNumber(input.phone)) {
        const customer = customers.find((customer) => {
          return customer.name === input.name;
        });
        const isValid = turns.some((turn) => {
          if (turn.completed) {
            return false;
          }
          return turn.customer.phone === customer.phone;
        });
        if (!isValid) {
          addTurn(createTurn(), "turnCustomerSchedule");
          setInput({});
          setIsEnabledButton(true);
        } else {
          toast.warning("Ya existe un turno para este cliente", {
            autoClose: 3000,
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      }
    }
  };

  const createTurn = () => {
    return {
      id: turn ? turn.id : null,
      id_customer: selectCustomer.id_customer,
      name: input.name.toLowerCase(),
      phone: input.phone,
      price: input.price,
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

  const handlePrice = (event) => {
    setInput({
      ...input,
      price: event.target.value,
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
    const filterResult = customers.filter((customer) =>
      customer.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSearchCustomers(filterResult);
  };

  return (
    <>
    <div >
      <Modal isOpen={upPopup}>
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
          <form className="turn-form-popup" onSubmit={handleSend}>
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
            {!invited ? <input
              disabled
              className="turn-input"
              type="number"
              placeholder="Telefono"
              autoComplete="off"
              value={input.phone ?? ""}
              onChange={handlePhone}
            /> : null}
            <input
              disabled={turn && turn.customer.id_customer ? true : false}
              className="turn-input"
              type="time"
              pattern="[0-9]{2}:[0-9]{2}\s(AM|PM)"
              value={input.date_register ?? ""}
              onChange={handleDateRegister}
            ></input>
            <input
              className="turn-input"
              type="number"
              placeholder="precio $"
              autoComplete="off"
              value={input.price ?? ""}
              onChange={handlePrice}
            />
            <button
              hidden={isEnabledButton}
              className="btn-sm rounded create-turn-popup"
            >
              {turn && turn.customer.id_customer
                ? "Editar turno"
                : "asignar Turno"}
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
      </div>
    </>
  );
}
