import { auth } from "../../firebase";

import "./turn.css";
import FormTurn from "./formTurn/formTurn";
import { useEffect, useState } from "react";
import Homeworks from "./homework/homework";
import { ToastContainer, toast } from 'react-toastify';
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function Turn() {
  const [turns, setTurns] = useState([]);
  const apiUrl = process.env.REACT_APP_API;
  const [isLoading, setIsLoading] = useState(false);
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
    };
    getturnById();
  }, [idFirebaseUser, turnResponse]);

  /**
   * Allow save turn by user
   */
  const saveTurn = async (turn) => {
    const responseAddTurn = await fetch(`${apiUrl}/turns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(turn),
    });
    return await responseAddTurn.json();
  };

  const addTurn = async (turn) => {
    if (turn) {
      const responseTurn = await saveTurn(turn);
      setTurnResponse(responseTurn);
      toast.success('Agregaste un turno', { autoClose: 1000 , position: toast.POSITION.TOP_CENTER });
    }
  };

  const deleteTurn = async (id) => {
    const deleteTurn = await fetch(`${apiUrl}/turns/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseDeleteTurn = deleteTurn.json();
    setTurnResponse(responseDeleteTurn);
    toast.error('Eliminaste un turno', { autoClose: 1000 , position: toast.POSITION.TOP_CENTER });
  };

  const handleDragEnd = async (event) => {
    try {
      const { active, over } = event;
      const oldIndex = turns.findIndex((turn) => turn.id === active.id);
      const newIndex = turns.findIndex((turn) => turn.id === over.id);
      const arrayOrder = arrayMove(turns, oldIndex, newIndex);
      if(oldIndex === newIndex){
        return;
      }
      if (oldIndex > newIndex) {
        if (arrayOrder.length > 0) {
          let count = 1;
          arrayOrder.forEach((element) => {
            return (element.order = count++);
          });
          if (active.id !== over.id) {
            const updateArray = await fetch(`${apiUrl}/turns/order/update/${newIndex}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(arrayOrder),
            });
            const responseUpdateTask = updateArray.json();
            setTurnResponse(responseUpdateTask);
            toast.success('Haz movido un turno', { autoClose: 1000 , position: toast.POSITION.TOP_CENTER });
          }
        }
      }else{
        toast.error('No puedes mover un turno de arriba hacia abajo', { autoClose: 1000 , position: toast.POSITION.TOP_CENTER });
      }
    } catch (error) {
      console.log(error);
    }
    
  };

  return (
    <div className="container-turn">
      <ToastContainer/>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {isLoading ? (
          <p>Cargando informacion...</p>
        ) : (
          <>
            <FormTurn addTurn={addTurn}></FormTurn>
            <div className="turn-list-content">
              <SortableContext
                items={turns}
                strategy={verticalListSortingStrategy}
              >
                {turns.map((turn) => (
                  <Homeworks
                    key={turn.id}
                    id={turn.id}
                    text={turn.name}
                    turnDate={turn.date_register}
                    deleteTurn={deleteTurn}
                  />
                ))}
              </SortableContext>
            </div>
          </>
        )}
      </DndContext>
    </div>
  );
}
