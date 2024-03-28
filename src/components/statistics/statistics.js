import { useState } from "react";

import "./statistics.css";
import { QUESTIONS } from "../../constants";
import CustomerTimes from "../modal/customerTImes/customerTimes";

export default function Statistics() {
  const [showstatsTimes, setShowstatsTimes] = useState(false);
  const [query, setquery] = useState("");
  const apiUrl = process.env.REACT_APP_API;

  const showCustomerTimesMethod = () => {
    setquery("");
    setShowstatsTimes(false);
  };

  const buildQuery = (query) => {
    setquery(query);
    setShowstatsTimes(true);
  };


  // const sendOpenIa = async () => {
  //   const responseCutomers = await fetch(`${apiUrl}/statistics/openia/${input.name}`);
  //   const response = await responseCutomers.json();
  //   setCustomerTimes(response);
  // };

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
