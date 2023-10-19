import { useEffect, useState } from "react";
import "./formTurn.css";

export default function Formturn({ addTurn, customer, schedule }) {
  const [input, setInput] = useState({
    id_customer: null,
    name: "",
    phone: "",
  });
  const [isEnabledButton, setIsEnabledButton] = useState(true);

  useEffect(() => {
    if (customer && customer.id_customer) {
      setInput(customer);
    }
  }, [customer]);

  useEffect(() => {
    if (input.name !== "" && input.phone !== "") {
      setIsEnabledButton(false);
    }
    if (input.name === "" || input.phone === "") {
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
      addTurn(createTurn(), "turnCustomer");
      setInput({});
      setIsEnabledButton(true);
    } else {
      addTurn(null, "turnCustomer");
    }
  };

  const createTurn = () => {
    return {
      id_customer: customer ? customer.id_customer : null,
      name: input.name.toLowerCase(),
      phone: input.phone,
    };
  };

  const handleName = (event) => {
    setInput({ ...input, name: event.target.value });
  };
  const handlePhone = (event) => {
    setInput({ ...input, phone: event.target.value });
  };

  return (
    <form className="turn-form" onSubmit={handleSend}>
      {schedule ? <h5>Crea un cliente</h5> : <h5>Agenda y crea un cliente</h5>}
      <input
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
        className="turn-input"
        type="number"
        placeholder="Telefono"
        autoComplete="off"
        value={input.phone ?? ""}
        onChange={handlePhone}
      />
      <button hidden={isEnabledButton} className="btn-sm rounded create-turn">
        {schedule
          ? customer
            ? "Editar cliente"
            : "Crea cliente"
          : "Crear turno"}
      </button>
    </form>
  );
}
