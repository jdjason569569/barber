import "./scheduleCard.css";
import { useEffect, useState } from "react";

export default function ScheduleCard({ turn }) {

  const [dateMoment, setDateMoment] = useState(null);

  useEffect(() => {
    let currentDate = new Date(turn.date_register);
    let hours = 0;
    let minutes = 0;
    if (process.env.REACT_APP_ZONE === "0") {
      hours = currentDate.getUTCHours();
      minutes = currentDate.getUTCMinutes();
    } else {
      hours = currentDate.getHours();
      minutes = currentDate.getMinutes();
    }

    let horaFormateada =
      hours.toString().padStart(2, "0") +
      ":" +
      minutes.toString().padStart(2, "0");

    setDateMoment(horaFormateada);
  }, [turn]);
  return (
    <>
      <div
        className={
          turn.completed
            ? "turn-container-schedule turn-container-schedule-completed"
            :  turn.disable ?  "turn-container-schedule turn-container-schedule-cancel" : "turn-container-schedule"
        }
      >
        <div className="turn-text text-style">{turn.customer.name}</div>
        <div className="text-date-schedule ">{dateMoment}</div>
      </div>

    </>
  );
}
