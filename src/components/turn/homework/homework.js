import "./homework.css";
import moment from "moment";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Homeworks({ id, deleteTurn, completeTurn, turn }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

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
          {moment(turn.date_register).format("HH:mm")}
        </div>
        {turn.completed ? (
          <span
            className="material-symbols-rounded icons"
            onMouseDown={() => completeTurn(turn)}
          >
            check
          </span>
        ) : (
          <span
            className="material-symbols-rounded icons"
            onMouseDown={() => completeTurn(turn)}
          >
            pending_actions
          </span>
        )}
        <span
          className="material-symbols-rounded icons"
          onMouseDown={() => deleteTurn(turn)}
        >
          delete
        </span>
      </div>
    </div>
  );
}
