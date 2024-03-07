import { auth } from "../../firebase";

import "./turn.css";
import { useEffect, useState } from "react";
import Homeworks from "./homework/homework";
import { ToastContainer, toast } from "react-toastify";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  DndContext,
  useSensors,
  useSensor,
  closestCenter,
  TouchSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import EmptyList from "../emptyList/emptyList";
import Loader from "../loader/loader";
import PopupAddTurn from "../modal/addTurn/popupAddTurn";

export default function Turn() {
  const [turns, setTurns] = useState([]);
  const apiUrl = process.env.REACT_APP_API;

  const [isLoading, setIsLoading] = useState(false);
  const [idFirebaseUser, setIdFirebaseUser] = useState(null);
  const [turnResponse, setTurnResponse] = useState(null);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(touchSensor);
  const [customers, setCustomers] = useState([]);
  const [searchCustomers, setSearchCustomers] = useState([]);
  const [showPoppup, setShowPoppup] = useState(false);
  const [turn, setTurn] = useState(null);
  const [enableCards, setEnableCards] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user ? setIdFirebaseUser(user.uid) : setIdFirebaseUser(null);
    });
  }, [apiUrl]);

  useEffect(() => {
    const getturnById = async () => {
      try {
        setIsLoading(true);
        const idUser = await getUserById();
        if (idUser) {
          const responseturnByUser = await fetch(
            `${apiUrl}/turns/turncustomer/${idUser}`
          );
          const responseturnByUserJson = await responseturnByUser.json();
          setTurns(responseturnByUserJson);
          setIsLoading(false);
        }
      } catch (error) {
        //console.error(error);
      }
    };
    getturnById();

    const getCustomers = async () => {
      try {
        const idUser = await getUserById();
        if (idUser) {
          const responseCutomers = await fetch(
            `${apiUrl}/customer/byuser/${idUser}`
          );
          const responseCustomersJson = await responseCutomers.json();
          setCustomers(responseCustomersJson);
          setSearchCustomers(responseCustomersJson);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        //console.error(error);
      }
    };
    getCustomers();
  }, [idFirebaseUser, turnResponse, apiUrl, showPoppup]);

  /**
   * Allow save turn by user
   */
  const saveTurn = async (turn, method) => {
    turn.id_users = await getUserById();
    turn.customer = {
      name: turn.name,
      phone: turn.phone,
    };
    turn.customer.user = {
      id_users: turn.id_users,
    };
    const responseAddTurn = await fetch(`${apiUrl}/turns/${method}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(turn),
    });
    return await responseAddTurn.json();
  };

  const updateTurn = async (turn) => {
    const id = turn.id;
    const responseAddTurn = await fetch(`${apiUrl}/turns/turn/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(turn),
    });
    return await responseAddTurn.json();
  };

  const addTurn = async (turn, method) => {
    setShowPoppup(false);
    if (turn.id) {
      const responseTurn = await updateTurn(turn, method);
      setTurnResponse(responseTurn);
      switch (responseTurn.status) {
        case "sameHour":
          toast.warn(responseTurn.message);
          break;
        case "success":
          toast.success(responseTurn.message);
          break;
        case "error":
          toast.warn(responseTurn.message);
          break;
      }
      setTurn(null);
    } else {
      const responseTurn = await saveTurn(turn, method);
      setTurnResponse(responseTurn);
      switch (responseTurn.status) {
        case "sameHour":
          toast.warn(responseTurn.message);
          break;
        case "success":
          toast.success(responseTurn.message);
          break;
        case "error":
          toast.warn(responseTurn.message);
          break;
      }
    }
  };

  /**
   * Allow return an user by firebase code
   */
  const getUserById = async () => {
    try {
      const respGetUserById = await fetch(`${apiUrl}/user/${idFirebaseUser}`);
      const response = await respGetUserById.json();
      return response.id_users;
    } catch (error) {
      return null;
    }
  };

  const disableTurn = async (id) => {
    const disableTurn = await fetch(`${apiUrl}/turns/disable/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseDisableTurn = await disableTurn.json();
    const response = {
      value: responseDisableTurn,
    };
    setTurnResponse(response);
    //TODO response server
    toast.error("Cancelaste un turno");
  };

  const completeTurn = async (turn) => {
    if (!turn.completed) {
      let dateRegister = null;
      if (process.env.REACT_APP_ZONE === "0") {
        dateRegister = new Date();
        let currentDateAux = new Date(turn.date_register);
        dateRegister.setHours(currentDateAux.getUTCHours());
        dateRegister.setMinutes(currentDateAux.getUTCMinutes());
        dateRegister.setSeconds(currentDateAux.getUTCSeconds());
      } else {
        dateRegister = new Date(turn.date_register);
      }
      const currentDate = new Date();
      if (dateRegister < currentDate) {
        const idStatus = turn.id;
        turn.completed = !turn.completed;
        const response = await fetch(`${apiUrl}/turns/completed/${idStatus}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(turn),
        });
        setTurnResponse(response);
        toast.success("Haz completado un turno");
      } else {
        toast.error("Para completar un turno, de ser menor a la hora actual");
      }
    }
  };

  const handleDragEnd = async (event) => {
    try {
      const { active, over } = event;
      const oldIndex = turns.findIndex((turn) => turn.id === active.id);
      const newIndex = turns.findIndex((turn) => turn.id === over.id);
      const isAlreadyComplete = turns
        .slice(newIndex, oldIndex + 1)
        .some((turn) => turn.completed === true);
      const turnSelected = turns.find((turn) => turn.id === active.id);
      const oldTurn = turns.find((turn) => turn.id === over.id);
      const arrayOrder = arrayMove(turns, oldIndex, newIndex);
      const obj = {
        arrayOrder,
        turns,
      };
      if (oldIndex === newIndex) {
        return;
      }
      if (!isAlreadyComplete) {
        if (!oldTurn.completed) {
          if (!turnSelected.completed) {
            if (oldIndex > newIndex) {
              if (arrayOrder.length > 0) {
                let count = 1;
                arrayOrder.forEach((element) => {
                  return (element.order = count++);
                });
                if (active.id !== over.id) {
                  const updateArray = await fetch(
                    `${apiUrl}/turns/order/update/${newIndex}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(obj),
                    }
                  );
                  const responseUpdateTask = await updateArray.json();
                  if (responseUpdateTask.status === "success") {
                    setTurnResponse(responseUpdateTask);
                    toast.success(responseUpdateTask.message);
                  } else {
                    toast.error(responseUpdateTask.message);
                  }
                }
              }
            } else {
              toast.error("No puedes mover un turno de arriba hacia abajo");
            }
          } else {
            toast.error("No puedes mover una tarjeta atendida");
          }
        } else {
          toast.error("No puedes mover por encima de una tarjeta atendida");
        }
      } else {
        toast.error(
          "No puedes mover un turno por encima de turnos ya atendidos"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const postponeTurns = async () => {
    const turnNoSchedule = turns.filter(
      (turn) => !turn.isSchedule && !turn.completed
    );
    if (turnNoSchedule.length > 0) {
      const updateArray = await fetch(`${apiUrl}/turns/postpone`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(turnNoSchedule),
      });
      const responseUpdateTask = await updateArray.json();
      if (responseUpdateTask.status === "success") {
        setTurnResponse(responseUpdateTask);
        toast.success(responseUpdateTask.message);
      } else {
        toast.error(responseUpdateTask.message);
      }
    } else {
      toast.error("No tienes turnos que aplazar");
    }
  };

  const showPoppupMethod = () => {
    setShowPoppup(false);
  };

  const editTurn = (turn) => {
    setTurn(turn);
    setShowPoppup(true);
  };

  const enableCardsMethod = () => {
    setEnableCards(!enableCards)
  };

  const disableCardsMethod = () => {
    setEnableCards(true)
  };

  return (
    <>
      <ToastContainer position="bottom-center" autoClose={3000} />
      <div className="container-turn">
        <div className="conatiner-search">
          {/* <button
            onClick={postponeTurns}
            className="btn-sm rounded hold-over-botton"
          >
            Aplazar turnos (10 min)
          </button> */}
          <button
            className="btn-sm rounded style-schedule-button"
            onClick={() => setShowPoppup(true)}
          >
            Agregar turno
          </button>
          <button
            className={enableCards ? "btn-sm rounded style-schedule-button move-turns" : "btn-sm rounded style-schedule-button disabled-turns"}
            onClick={() => enableCardsMethod()}
          >
            {enableCards ?  'Mover turno' : 'Cancelar'}
          </button>
          {showPoppup && (
            <PopupAddTurn
              addTurn={addTurn}
              upPopup={showPoppup}
              showPoppupMethod={showPoppupMethod}
              listTurns={turns}
              listCustomers={customers}
              turn={turn}
            ></PopupAddTurn>
          )}
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
          disabled={true}
        >
          <div className="turn-list-content">
            <h5 className="turn-title">Turnos disponibles</h5>
            {isLoading ? (
              <Loader></Loader>
            ) : (
              <div>
                {turns.length > 0 ? (
                  <SortableContext
                    items={turns}
                    strategy={verticalListSortingStrategy}
                  >
                    {turns.map((turn) => (
                      <Homeworks
                        key={turn.id}
                        id={turn.id}
                        turn={turn}
                        disableTurn={disableTurn}
                        completeTurn={completeTurn}
                        editTurn={editTurn}
                        enableCards={enableCards}
                        disableCardsMethod={disableCardsMethod}
                      />
                    ))}
                  </SortableContext>
                ) : (
                  <EmptyList text="turnos" />
                )}
              </div>
            )}
          </div>
        </DndContext>
      </div>
    </>
  );
}
