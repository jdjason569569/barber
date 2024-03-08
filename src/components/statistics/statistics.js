import { useState } from "react";

import "./statistics.css";
import { QUESTIONS } from "../../constants";
import CustomerTimes from "../modal/customerTImes/customerTimes";

export default function Statistics() {
  const [showstatsTimes, setShowstatsTimes] = useState(false);
  const [query, setquery] = useState("");

  const showCustomerTimesMethod = () => {
    setquery("");
    setShowstatsTimes(false);
  };

  const buildQuery = (value, query) => {
    setquery(query);
    setShowstatsTimes(value);
  };

  return (
    <>
      <div className="content-stats">
        <div>
          {QUESTIONS.map((question) => (
            <div
              key={question.id}
              className={"stats-container"}
              onClick={() => buildQuery(true, question.query)}
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
    </>
  );
}
