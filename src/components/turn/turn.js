import { auth } from '../../firebase';

import './turn.css'
import Formturn from './formTurn/formTurn';
import { useEffect, useState } from 'react';
import Homeworks from './homework/homework';
import { ToastContainer, toast } from 'react-toastify';

export default function Turn() {

  const [turns, setturns] = useState([]);
  const apiUrl = process.env.REACT_APP_API;
  const [isLoading, setIsLoading] = useState(false);
  const [turnEdit, setturnEdit] = useState(null);
  const [idFirebaseUser, setIdFirebaseUser] = useState(null);
  const [turnResponse, setturnResponse] = useState(null);

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
    // const getturnById = async () => {
    //   try {
    //     setIsLoading(true);
    //     const idUser = await getUserById();
    //     const responseturnByUser = await fetch(`${apiUrl}/turns/${idUser}`);
    //     const responseturnByUserJson = await responseturnByUser.json();
    //     setturns(responseturnByUserJson);
    //     setIsLoading(false);
    //   } catch (error) {
    //     //console.error(error);
    //   }
    // }
    // getturnById();
  }, [idFirebaseUser, turnResponse]);


  /**
   * Allow return an user by firebase code
   */
  const getUserById = async () => {
    const respGetUserById = await fetch(`${apiUrl}/user/${idFirebaseUser}`);
    const response= await respGetUserById.json();
    return response.id_users;
  }

  /**
   * Allow save turn by user
   */
  const saveturnByUser = async (turn) => {
    const responseAddturn = await fetch(`${apiUrl}/turns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(turn)
    });
    return await responseAddturn.json();
  }


  const addturn = async (turn) => {
    if (turn) {
      if (turnEdit) {
        turnEdit.name = turn.name;
        const Updateturn = await fetch(`${apiUrl}/turns/${turnEdit.id_turn}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(turnEdit)
        });
        const responseUpdateturn = Updateturn.json();
        setturnResponse(responseUpdateturn);
        toast.warning('Editaste una tarea', { autoClose: 1000 }, { position: toast.POSITION.TOP_CENTER });
        setturnEdit(null);
      } else {
        const idUser = await getUserById();
        turn.id_users = idUser;
        const responseturn = await saveturnByUser(turn);
        setturnResponse(responseturn);
        toast.success('Agregaste una tarea', { autoClose: 1000 }, { position: toast.POSITION.TOP_CENTER });
      }
    }
  }

  const deleteturn = async (id) => {
    const deleteturn = await fetch(`${apiUrl}/turns/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const responseDeleteturn = deleteturn.json();
    setturnResponse(responseDeleteturn);
    toast.error('Eliminaste una tarea', { autoClose: 1000 }, { position: toast.POSITION.TOP_CENTER });
  }

  const completeturn = async (id) => {
    const turn = turns.find(turn => turn.id_turn === id);
    turn.completed = !turn.completed;

    const Updateturn = await fetch(`${apiUrl}/turns/${turn.id_turn}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(turn)
    });
    const responseUpdateturn = Updateturn.json();
    setturnResponse(responseUpdateturn);
    if (turn.completed) {
      toast.success('Completaste una tarea', { autoClose: 1000 }, { position: toast.POSITION.TOP_CENTER });
    } else {
      toast.warning('Desmarcaste una tarea', { autoClose: 1000 }, { position: toast.POSITION.TOP_CENTER });
    }

  }

  const editturn = id => {
    const turn = turns.find(turn => turn.id_turn === id);
    setturnEdit(turn);
  }

  return (
    <div className='container-turn'>
       <ToastContainer />
      {isLoading ? (<p>Cargando informacion...</p>) : (<><Formturn addturn={addturn} turnEdit={turnEdit}></Formturn>
        <div className='turn-list-content'>
          {
            turns.map((turn) =>
              <Homeworks
                key={turn.id_turn}
                id={turn.id_turn}
                text={turn.name}
                turnDate={turn.date_register}
                completed={turn.completed}
                deleteturn={deleteturn}
                completeturn={completeturn}
                editturn={editturn} />)
          }
        </div>
      </>)}
    </div>)
}