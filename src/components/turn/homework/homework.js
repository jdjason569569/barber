import './homework.css'
import moment from 'moment';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Homeworks({ id, text, completed, deleteTurn, completeTurn, turnDate }) {

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


    return (
        <div style={style}
           ref={setNodeRef}
               {...attributes}
               {...listeners}>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
                rel="stylesheet" />

            <div className={completed ? "turn-container completed" : 'turn-container'}>
                <div className="turn-text" onMouseDown={() => completeTurn(id)}>
                    {text}
                    <div className='text-date '>{moment(turnDate).format('LL')}</div>
                </div>
                <div className='icons' onMouseDown={() => deleteTurn(id)}>
                <i className="material-icons">delete</i>
                </div>
            </div>
        </div>
    )
}