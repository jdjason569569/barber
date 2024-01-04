import "./homework.css";
import moment from "moment";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import "moment-timezone";

export default function Homeworks({ id, deleteTurn, completeTurn, turn }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const [dateMoment, setDateMoment] = useState(null);
  

  useEffect(() => {
    let currentDate = new Date(turn.date_register);
    var horas = currentDate.getHours();
    var minutos = currentDate.getMinutes();
    var horaFormateada =
      horas.toString().padStart(2, "0") +
      ":" +
      minutos.toString().padStart(2, "0");

    setDateMoment(horaFormateada);
  }, [turn]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div style={style} ref={setNodeRef} {...attributes} {...listeners}>
      <div
        className={
          turn.completed
            ? "turn-container turn-container-completed"
            : "turn-container"
        }
      >
        <div className="text-style" style={{ marginLeft: "5%" }}>
            {turn.order}
        </div>
        <div className="turn-text text-style">{turn.customer.name}</div>
        <div className="text-date">
          {dateMoment}
        </div>
        {turn.completed ? (
          <div className="icon-container">
            <span
              className="material-symbols-rounded style-bottom"
              onMouseDown={() => completeTurn(turn)}
            >
              check
            </span>
            </div>
        ) : (
          <div className="icon-container">
            <span
              className="material-symbols-rounded style-bottom"
              onMouseDown={() => completeTurn(turn)}
            >
              pending_actions
            </span>
            <span
              className="material-symbols-rounded style-bottom"
              onMouseDown={() => deleteTurn(id)}
            >
              delete
            </span>
            </div>
        )}
      </div>
    </div>
  );
}
