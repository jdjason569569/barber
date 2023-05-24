import { useEffect, useState } from "react";
import './formTurn.css';

export default function Formturn({ addTurn, turnEdit }) {

    const [input, setInput] = useState(null);
    const [isEnabledButton, setIsEnabledButton] = useState(true);
    const [isEditturn, setIsEditTurn] = useState(false);

    useEffect(() => {
        if (turnEdit) {
            setInput(turnEdit.name);
            setIsEnabledButton(false);
            setIsEditTurn(true);
        }
    }, [turnEdit])

    const handleEvent = e => {
        setInput(e.target.value);
        if (input) {
            setIsEnabledButton(false);
        }
    }

    const handleSend = e => {
        e.preventDefault();
        if (input !== '') {
            addTurn(createTurn());
            setInput('');
            setIsEnabledButton(true);

        }
    }

    const createTurn = () => {
        if (isEditturn) {
            return {
                name: input,
                completed: false,
            }
        } else {
            return {
                name: input,
                completed: false,
            }
        }
    }

    return (
        <form className="turn-form" onSubmit={handleSend}>
            <input
                className='turn-input'
                type='text'
                placeholder='Crea un turno'
                name='texto'
                autoComplete="off"
                value={input ?? ''}
                onChange={handleEvent}
            />
            <button hidden={isEnabledButton} className="btn-sm rounded turn-botton" >
                {turnEdit ? 'Editar Tarea' : 'Crear turno'}
            </button>
        </form>
    )
}