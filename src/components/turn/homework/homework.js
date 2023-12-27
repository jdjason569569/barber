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
            : turn.isSchedule
            ? "turn-container  turn-container-is-scheduled"
            : "turn-container"
        }
      >
        <div className="text-style" style={{ marginLeft: "5%" }}>
          {turn.isSchedule ? (
            <span className="material-symbols-rounded icons">schedule</span>
          ) : (
            turn.order
          )}
        </div>
        <div className="turn-text text-style">{turn.customer.name}</div>
        <div className="text-date">
          {/* {moment(turn.date_register).format("HH:mm")} */}

          {dateMoment}
        </div>
        {turn.completed ? (
          <ng-container>
            <span
              className="material-symbols-rounded icons"
              onMouseDown={() => completeTurn(turn)}
            >
              check
            </span>
          </ng-container>
        ) : (
          <ng-container>
            <span
              className="material-symbols-rounded icons"
              onMouseDown={() => completeTurn(turn)}
            >
              pending_actions
            </span>
            <span
              className="material-symbols-rounded icons"
              onMouseDown={() => deleteTurn(id)}
            >
              delete
            </span>
          </ng-container>
        )}
      </div>
    </div>
  );
}
