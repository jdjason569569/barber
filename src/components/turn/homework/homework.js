import "./homework.css";
import moment from "moment";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Homeworks({ id, name,deleteTurn, turnDate, order }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div style={style} ref={setNodeRef} {...attributes} {...listeners}>
      <div className={"turn-container"}>
        <div className="text-style" style={{ marginLeft: "5%" }}>{order}</div>
        <div className="turn-text text-style">
          {name}
        </div>
        <div className="text-date">{moment(turnDate).format("HH:mm")}</div>
        <span className="material-symbols-rounded icons" onMouseDown={() => deleteTurn(id)}>delete</span>
      </div>
    </div>
  );
}
