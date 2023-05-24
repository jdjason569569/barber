import { auth } from '../../firebase';

import './turn.css'
import FormTurn from './formTurn/formTurn';
import { useEffect, useState } from 'react';
import Homeworks from './homework/homework';
import { ToastContainer, toast } from 'react-toastify';

export default function Turn() {

  const [turns, setTurns] = useState([]);
  const apiUrl = process.env.REACT_APP_API;
  const [isLoading, setIsLoading] = useState(false);
  const [turnEdit, setturnEdit] = useState(null);
  const [idFirebaseUser, setIdFirebaseUser] = useState(null);
  const [turnResponse, setTurnResponse] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIdFirebaseUser(user.uid);
      } else {
        setIdFirebaseUser(null);
      }
    });
  }, [apiUrl]);

  useEffect(() => {
     const getturnById = async () => {
       try {
         setIsLoading(true);
         const responseturnByUser = await fetch(`${apiUrl}/turns`);
         const responseturnByUserJson = await responseturnByUser.json();
         setTurns(responseturnByUserJson);
         setIsLoading(false);
       } catch (error) {
         //console.error(error);
       }
     }
     getturnById();
  }, [idFirebaseUser, turnResponse]);

  /**
   * Allow save turn by user
   */
  const saveTurn = async (turn) => {
    const responseAddTurn = await fetch(`${apiUrl}/turns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(turn)
    });
    return await responseAddTurn.json();
  }


  const addTurn = async (turn) => {
    if (turn) {
        const responseTurn = await saveTurn(turn);
        setTurnResponse(responseTurn);
        toast.success('Agregaste una tarea', { autoClose: 1000 }, { position: toast.POSITION.TOP_CENTER });
      }
  }

  const deleteTurn = async (id) => {
    const deleteTurn = await fetch(`${apiUrl}/turns/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const responseDeleteTurn = deleteTurn.json();
    setTurnResponse(responseDeleteTurn);
    toast.error('Eliminaste una tarea', { autoClose: 1000 }, { position: toast.POSITION.TOP_CENTER });
  }

  const completeTurn = async (id) => {
    const turn = turns.find(turn => turn.id_turn === id);
    turn.completed = !turn.completed;

    const UpdateTurn = await fetch(`${apiUrl}/turns/${turn.id_turn}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(turn)
    });
    const responseUpdateTurn = UpdateTurn.json();
    setTurnResponse(responseUpdateTurn);
    if (turn.completed) {
      toast.success('Completaste una tarea', { autoClose: 1000 }, { position: toast.POSITION.TOP_CENTER });
    } else {
      toast.warning('Desmarcaste una tarea', { autoClose: 1000 }, { position: toast.POSITION.TOP_CENTER });
    }

  }

  const editTurn = id => {
    const turn = turns.find(turn => turn.id_turn === id);
    setturnEdit(turn);
  }

  return (
    <div className='container-turn'>
       <ToastContainer />
      {isLoading ? (<p>Cargando informacion...</p>) : (<><FormTurn addTurn={addTurn} turnEdit={turnEdit}></FormTurn>
        <div className='turn-list-content'>
          {
            turns.map((turn) =>
              <Homeworks
                key={turn.id_turn}
                id={turn.id_turn}
                text={turn.name}
                turnDate={turn.date_register}
                completed={turn.completed}
                deleteTurn={deleteTurn}
                completeTurn={completeTurn}
                editTurn={editTurn} />)
          }
        </div>
      </>)}
    </div>)
}