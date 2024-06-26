import "./homework.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";

export default function Homeworks({
  id,
  disableTurn,
  completeTurn,
  editTurn,
  turn,
  enableCards,
  disableCardsMethod,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, disabled: enableCards });

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
    setDateMoment(aMpM(horaFormateada));
    disableCardsMethod();
  }, [turn]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
    <div style={style} ref={setNodeRef} {...attributes} {...listeners}>
      <div
        className={
          turn.completed
            ? "turn-container turn-container-completed"
            : turn.disable
            ? "turn-container turn-container-cancel"
            : "turn-container"
        }
      >
        <div className="text-style" style={{ marginLeft: "5%" }}>
          {turn.order}
        </div>
        <div className="container-turn-text turn-text">
          <div className="turn-text">{turn.customer.name}</div>
          <div className="turn-text-phone">{turn.customer.phone}</div>
        </div>
        <div className="text-date">{dateMoment}</div>
        {turn.completed ? (
          <div className="icon-container-homework">
            <span
              className="material-symbols-rounded style-bottom-homework"
              onMouseDown={() => completeTurn(turn)}
            >
              check
            </span>
          </div>
        ) : (
          <div className="icon-container-homework">
            <span
              className="material-symbols-rounded style-bottom-homework"
              onMouseDown={() => completeTurn(turn)}
            >
              pending_actions
            </span>
            <span
              className="material-symbols-rounded style-bottom-homework"
              onMouseDown={() => editTurn(turn)}
            >
              edit
            </span>
            <span
              className="material-symbols-rounded style-bottom-homework"
              onMouseDown={() => disableTurn(id)}
            >
              delete
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
