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

    let formatTime =
      hours.toString().padStart(2, "0") +
      ":" +
      minutes.toString().padStart(2, "0");

    setDateMoment(aMpM(formatTime));
  }, [turn]);


  const aMpM = (hour24) => {
    let hora = hour24.split(':');
    let horaNum = parseInt(hora[0]);
    let minutos = hora[1];
    let ampm = horaNum >= 12 ? 'PM' : 'AM';
    horaNum = horaNum % 12 || 12;
    let horaAMPM = horaNum + ':' + minutos + ' ' + ampm;
    return horaAMPM;
  }
  return (
    <>
      <div
        className={
          turn.completed
            ? "turn-container-schedule turn-container-schedule-completed"
            :  turn.disable ?  "turn-container-schedule turn-container-schedule-cancel" : "turn-container-schedule"
        }
      >
        <div className="turn-text-schedule ">{turn.customer.name}</div>
        {turn.completed ? <div className="turn-text-schedule ">{turn.price} pesos</div> : null}
        <div className="text-date-schedule ">{dateMoment}</div>
      </div>

    </>
  );
}
