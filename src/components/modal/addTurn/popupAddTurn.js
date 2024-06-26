import { Modal, ModalBody, ModalHeader } from "reactstrap";
import "../addTurn/popupAddTurn.css";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import DatePicker from "react-datepicker";

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

  const [inputHour, setInputHour] = useState("");

  const [isEnabledButton, setIsEnabledButton] = useState(true);
  const [selectCustomer, setSelectCustomer] = useState("");
  const [inputValueSearch, setInputValueSearch] = useState("");
  const turns = listTurns;
  const customers = listCustomers;
  const [searchCustomers, setSearchCustomers] = useState(listCustomers);
  const [fastCustomer, setFastCustomer] = useState(false);

  const invited = JSON.parse(localStorage.getItem("invited"));

  useEffect(() => {
    if (turn !== null) {
      setFastCustomer(turn.is_fast_customer);
      setInputHour(aMpM(manageDateRegister(turn.date_register)));
    }
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
    if (fastCustomer && input.price) {
      setIsEnabledButton(false);
      return;
    }
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
    if (fastCustomer) {
      addTurn(createTurn(), "fastCustomer");
      setInput({});
      setIsEnabledButton(true);
      return;
    }
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
    setFastCustomer(false);
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

  const handleDateRegister = (date) => {
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const time =
      hour.toString().padStart(2, "0") +
      ":" +
      minutes.toString().padStart(2, "0");
    setInputHour(aMpM(time));
    setInput({
      ...input,
      date_register: time,
    });
  };

  const aMpM = (hour24) => {
    let hora = hour24.split(":");
    let horaNum = parseInt(hora[0]);
    let minutos = hora[1];
    let ampm = horaNum >= 12 ? "PM" : "AM";
    horaNum = horaNum % 12 || 12;
    let horaAMPM = horaNum + ":" + minutos + " " + ampm;
    return horaAMPM;
  };

  const searchCustomerByName = (name) => {
    return customers.find((customer) => customer.name === name);
  };

  const showPoppup = (value) => {
    return showPoppupMethod(value);
  };

  const handleInputChange = (event) => {
    setInputValueSearch(event.target.value.toLowerCase());
    const filterResult = customers.filter((customer) => {
      return (
        customer.name
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        customer.phone.includes(event.target.value.toLowerCase())
      );
    });
    setSearchCustomers(filterResult);
  };

  const changeToFastCustomer = () => {
    setInput({});
    setFastCustomer(true);
    setInput({
      ...input,
      name: "Cliente Rapido",
      phone: null,
    });
  };

  return (
    <>
      <div>
        <Modal isOpen={upPopup}>
          <ModalHeader>Agregar un horario especifico</ModalHeader>
          <ModalBody>
            <div className="container-search">
              <div className="input-group-add">
                <span className="title-client-add">Buscar</span>
                <input
                  type="text"
                  value={inputValueSearch}
                  onChange={handleInputChange}
                  aria-label="First name"
                  className="form-control"
                />
              </div>
              <span className="material-symbols-rounded style-bottom-add">
                <span
                  class="material-symbols-rounded"
                  onMouseDown={() => changeToFastCustomer()}
                >
                  acute
                </span>
              </span>
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
              {!invited && !fastCustomer ? (
                <input
                  disabled
                  className="turn-input"
                  type="number"
                  placeholder="Telefono"
                  autoComplete="off"
                  value={input.phone ?? ""}
                  onChange={handlePhone}
                />
              ) : null}
              {!fastCustomer ? (
                <DatePicker
                  disabled={turn}
                  className="turn-input"
                  onChange={(date) => handleDateRegister(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Hora"
                  dateFormat="h:mm aa"
                  placeholderText={inputHour ? inputHour : "Ingresa hora"}
                />
              ) : null}
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
