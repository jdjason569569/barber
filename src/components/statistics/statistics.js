import { useState } from "react";

import "./statistics.css";
import { QUESTIONS } from "../../constants";
import CustomerTimes from "../modal/customerTImes/customerTimes";

export default function Statistics() {
  const [showstatsTimes, setShowstatsTimes] = useState(false);
  const [query, setquery] = useState("");
  const apiUrl = process.env.REACT_APP_API;
  const [input, setInput] = useState({
    id_customer: null,
    name: "",
    phone: "",
  });
  const [customerTimes, setCustomerTimes] = useState([]);

  const showCustomerTimesMethod = () => {
    setquery("");
    setShowstatsTimes(false);
  };

  const buildQuery = (query) => {
    setquery(query);
    setShowstatsTimes(true);
  };

  const handleName = (event) => {
    setInput({ ...input, name: event.target.value });
  };

  const sendOpenIa = async () => {
    const responseCutomers = await fetch(`${apiUrl}/statistics/openia/${input.name}`);
    const response = await responseCutomers.json();
    setCustomerTimes(response);
  };

  return (
    <>
      <div className="content-stats">
        <div>
          {QUESTIONS.map((question) => (
            <div
              key={question.id}
              className={"stats-container"}
              onClick={() => buildQuery(question.query)}
            >
              <div className="icon-container">{question.text}</div>
            </div>
          ))}
        </div>
        <div>
          <input
            type="text"
            placeholder="Has una pregunta"
            name="texto"
            maxLength="80"
            autoComplete="off"
            value={input.name ?? ""}
            onChange={handleName}
          />
          <button
            className="btn btn-light btn-sm btn-pass"
            onClick={sendOpenIa}
          >enviar</button>

          {customerTimes}
        </div>
      </div>
      {
        <div>
          {showstatsTimes && (
            <CustomerTimes
              query={query}
              upPopup={showstatsTimes}
              showCustomerTimesMethod={showCustomerTimesMethod}
            />
          )}
        </div>
      }
      <div></div>
    </>
  );
}
