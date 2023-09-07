import { useEffect, useState } from "react";
import "./formTurn.css";

export default function Formturn({ addTurn, schedule }) {
  const [input, setInput] = useState({
    name: "",
    email: "",
  });
  const [isEnabledButton, setIsEnabledButton] = useState(true);

  useEffect(() => {
    if (input.name !== "" && input.email !== "") {
      setIsEnabledButton(false);
    }
    if (input.name === "" || input.email === "") {
      setIsEnabledButton(true);
    }
  }, [input]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@gmail\.com$/i;
    if (emailRegex.test(email)) {
      return true;
    } else {
        setInput({ ...input, email: 'El correo electronico es incorrecto' });
      return false;
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (input.name !== "" && validateEmail(input.email)) {
      addTurn(createTurn(), "turnCustomer");
      setInput({});
      setIsEnabledButton(true);
    }
  };

  const createTurn = () => {
    return {
      name: input.name.toLowerCase(),
      email: input.email.toLowerCase(),
    };
  };

  const handleName = (event) => {
    setInput({ ...input, name: event.target.value });
  };
  const handleEmail = (event) => {
    setInput({ ...input, email: event.target.value });
  };

  return (
    <form className="turn-form" onSubmit={handleSend}>
      
      {schedule ? <h5>Crea un cliente</h5> : <h5>Agenda y crea un cliente</h5>}
      <input
        className="turn-input"
        type="text"
        placeholder="Agrega nombre"
        name="texto"
        autoComplete="off"
        value={input.name ?? ""}
        onChange={handleName}
      />
      <input
        className="turn-input"
        type="text"
        placeholder="Ingresa email"
        name="texto"
        autoComplete="off"
        value={input.email ?? ""}
        onChange={handleEmail}
      />
      <button hidden={isEnabledButton} className="btn-sm rounded turn-botton">
      {schedule ? <h5>Crea cliente</h5> : <h5>Crear turno</h5>}
      </button>
    </form>
  );
}
