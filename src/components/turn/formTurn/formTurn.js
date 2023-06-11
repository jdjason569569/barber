import { useEffect, useState } from "react";
import './formTurn.css';

export default function Formturn({ addTurn, turnEdit }) {

    const [input, setInput] = useState({
        name: "",
        email: ""
    });
    const [isEnabledButton, setIsEnabledButton] = useState(true);
    

    useEffect(() => {
        if (input.name !== '' && input.email !== '') {
            setIsEnabledButton(false)
        }
        if (input.name === '' || input.email === '') {
            setIsEnabledButton(true)
        }
    }, [input])

    
    const handleSend = e => {
        e.preventDefault();
        if (input.name !== '' && input.email) {
            addTurn(createTurn());
            setInput({});
            setIsEnabledButton(true);
        }
    }

    const createTurn = () => {
            return {
                name: input.name,
                email: input.email
        }
    }

    const handleName = (event) => {
        setInput({ ...input, name: event.target.value });
    }
    const handleEmail = (event) => {
        setInput({ ...input, email: event.target.value });
    }

    return (
        <form className="turn-form" onSubmit={handleSend}>
            <input
                className='turn-input'
                type='text'
                placeholder='Crea un turno'
                name='texto'
                autoComplete="off"
                value={input.name ?? ''}
                onChange={handleName}
            />
            <input
                className='turn-input'
                type='text'
                placeholder='Ingresa numero de telefono'
                name='texto'
                autoComplete="off"
                value={input.email ?? ''}
                onChange={handleEmail}
            />
            <button  hidden={isEnabledButton}  className="btn-sm rounded turn-botton" >
                Crear turno
            </button>
        </form>
    )
}