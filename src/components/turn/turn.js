import { auth } from '../../firebase';

import './turn.css'
import FormTurn from './formTurn/formTurn';
import { useEffect, useState } from 'react';
import Homeworks from './homework/homework';
//import { ToastContainer, toast } from 'react-toastify';
import { DndContext, closestCenter} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

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
        console.log('actualizando use efect');
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
        //toast.success('Agregaste una tarea', { autoClose: 1000 , position: toast.POSITION.TOP_CENTER });
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
    //toast.error('Eliminaste una tarea', { autoClose: 1000 , position: toast.POSITION.TOP_CENTER });
  }

  // const completeTurn = async (id) => {
  //   const turn = turns.find(turn => turn.id === id);
  //   turn.completed = !turn.completed;

  //   const UpdateTurn = await fetch(`${apiUrl}/turns/${turn.id}`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(turn)
  //   });
  //   const responseUpdateTurn = UpdateTurn.json();
  //   setTurnResponse(responseUpdateTurn);
  //   if (turn.completed) {
  //     //toast.success('Completaste una tarea', { autoClose: 1000 ,  position: toast.POSITION.TOP_CENTER });
  //   } else {
  //     //toast.warning('Desmarcaste una tarea', { autoClose: 1000 ,  position: toast.POSITION.TOP_CENTER });
  //   }
  // }

  const handleDragEnd =async (event) =>{
    const {active, over} = event;
    console.log('active->',active.id);
    console.log('over->',over.id);
    if (!active.id !== over.id) {
        const oldIndex = turns.findIndex(turn => turn.id === active.id);
        const newIndex = turns.findIndex(turn => turn.id === over.id);
        console.log('oldIndex->',oldIndex);
        console.log('newIndex->',newIndex);
        const arrayOrder = arrayMove(turns, oldIndex ,newIndex)

        const updateArray = await fetch(`${apiUrl}/turns/order/create`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(arrayOrder)
        });
        const responseUpdateTask = updateArray.json();
        setTurnResponse(responseUpdateTask);
        
        
    };
  }
   


  return (
    <div className='container-turn'>
      <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
      {isLoading ? (<p>Cargando informacion...</p>) : (<><FormTurn addTurn={addTurn} turnEdit={turnEdit}></FormTurn>
        <div className='turn-list-content'>
        <SortableContext
            items={turns} strategy={verticalListSortingStrategy}>
          {
            turns.map((turn) =>
              <Homeworks
                key={turn.id}
                id={turn.id}
                text={turn.name}
                turnDate={turn.date_register}
                deleteTurn={deleteTurn}/>
                )
          }
          </SortableContext>
        </div>
      </>)}
      </DndContext>
    </div>)
}