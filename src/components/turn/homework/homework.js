import './homework.css'
import moment from 'moment';

export default function Homeworks({ id, text, completed, deleteTurn, completeTurn, turnDate, editTurn }) {
    return (
        <div>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
                rel="stylesheet" />

            <div className={completed ? "turn-container completed" : 'turn-container'}>
                <div className="turn-text" onClick={() => completeTurn(id)}>
                    {text}
                    <div className='text-date '>{moment(turnDate).format('LL')}</div>
                </div>
                <div className='icons' onClick={() => deleteTurn(id)}>
                <i className="material-icons">delete</i>
                </div>
            </div>
        </div>
    )
}