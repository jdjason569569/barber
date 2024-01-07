import { auth } from "../../firebase";

import "./turn.css";
import { useEffect, useState } from "react";
import Homeworks from "./homework/homework";
import { ToastContainer, toast } from "react-toastify";
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
import PopupAddTurn from "../modal/popupAddTurn";
import PopupCardInformation from "../modal/popupCardInformation";

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
  const [showPoppupInfo, setShowPoppupInfo] = useState(false);
  const [inputValueSearch, setInputValueSearch] = useState("");

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

  const addTurn = async (turn, method) => {
    setShowPoppup(false);
    if (turn && method) {
      const responseTurn = await saveTurn(turn, method);
      setTurnResponse(responseTurn);
      if (!responseTurn) {
        toast.error(
          "Ya existe un turno",
          {
            autoClose: 5000,
            position: toast.POSITION.TOP_CENTER,
          }
        );
      } else {
        toast.success("Agregaste un turno", {
          autoClose: 5000,
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } else {
      toast.error("Comprueba el numero de telefono!", {
        autoClose: 5000,
        position: toast.POSITION.TOP_CENTER,
      });
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

  const deleteTurn = async (id) => {
    const deleteTurn = await fetch(`${apiUrl}/turns/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseDeleteTurn = await deleteTurn.json();
    const response = {
      value: responseDeleteTurn,
    };
    setTurnResponse(response);
    toast.error("Eliminaste un turno", {
      autoClose: 5000,
      position: toast.POSITION.TOP_CENTER,
    });
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
        toast.success("Haz completado una cita", {
          autoClose: 5000,
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.error("Para completar la cita, de ser menor a la hora actual", {
          autoClose: 5000,
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  };

  const handleDragEnd = async (event) => {
    try {
      const turnNoSchedule = turns.filter((turn) => !turn.isSchedule);
      const { active, over } = event;
      const oldIndex = turns.findIndex((turn) => turn.id === active.id);
      const newIndex = turns.findIndex((turn) => turn.id === over.id);
      const turnSelected = turns.find((turn) => turn.id === active.id);
      const oldTurn = turns.find((turn) => turn.id === over.id);
      const arrayOrder = arrayMove(turnNoSchedule, oldIndex, newIndex);
      const obj ={
        arrayOrder,
        turns
      }
      if (oldIndex === newIndex) {
        return;
      }
      if (!turnSelected.isSchedule) {
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
                  const responseUpdateTask = updateArray.json();
                  setTurnResponse(responseUpdateTask);
                  toast.success("Haz movido un turno", {
                    autoClose: 5000,
                    position: toast.POSITION.TOP_CENTER,
                  });
                }
              }
            } else {
              toast.error("No puedes mover un turno de arriba hacia abajo", {
                autoClose: 5000,
                position: toast.POSITION.TOP_CENTER,
              });
            }
          } else {
            toast.error("No puedes mover una tarjeta atendida", {
              autoClose: 5000,
              position: toast.POSITION.TOP_CENTER,
            });
          }
        } else {
          toast.error("No puedes mover por encima de una tarjeta atendida", {
            autoClose: 5000,
            position: toast.POSITION.TOP_CENTER,
          });
        }
      } else {
        toast.error("No puedes mover una tarjeta creada manualmente", {
          autoClose: 5000,
          position: toast.POSITION.TOP_CENTER,
        });
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
      const responseUpdateTask = updateArray.json();
      setTurnResponse(responseUpdateTask);
      toast.success("Haz movido aplazado todos los turnos 10 minutos", {
        autoClose: 5000,
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error("No tienes turnos que aplazar", {
        autoClose: 5000,
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  // const handleChange = (event) => {
  //   setSelectCustomer(event.target.value);
  //   const customer = customers.find((customer) => {
  //     return customer.name === event.target.value;
  //   });
  //   console.log("Customer ",customer);

  //   const isValid = turns.find((turn) => {
  //     return turn.customer.phone === customer.phone;
  //   });
  //   if (!isValid) {
  //     setShowPoppupCreateTurn(true);
  //     // addTurn(customer, "turn");
  //     // setSelectCustomer("");
  //     // setInputValueSearch("");
  //   } else {
  //     toast.warning("Ya existe un turno para este cliente", {
  //       autoClose: 5000,
  //       position: toast.POSITION.TOP_CENTER,
  //     });
  //   }
  // };
  const handleInputChange = (event) => {
    setInputValueSearch(event.target.value.toLowerCase());
    const resultadosFiltrados = customers.filter((customer) =>
      customer.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSearchCustomers(resultadosFiltrados);
  };

  const showPoppupMethod = () => {
    setShowPoppup(false);
  };
  const showPoppupMethodInfo = () => {
    setShowPoppupInfo(false);
  };

  return (
    <>
      <ToastContainer />
      <div className="container-turn">
        <div className="conatiner-search">
          <div className="input-group">
            <span className="title-client">Buscar cliente</span>
            <input
              type="text"
              value={inputValueSearch}
              onChange={handleInputChange}
              aria-label="First name"
              className="form-control"
            />
          </div>
          {/* <select
            className="form-select form-select-active"
            style={{ marginTop: "2%" }}
            id="menu"
            value={selectCustomer}
            onChange={handleChange}
          >
            <option value=""> Seleccionar Cliente</option>
            {searchCustomers.map((customer) => (
              <option key={customer.id_customer} value={customer.name}>
                {customer.name}
              </option>
            ))}
          </select> */}
          <button
            onClick={postponeTurns}
            className="btn-sm rounded hold-over-botton"
          >
            Aplazar turnos (10 min)
          </button>
          <button
            className="btn-sm rounded style-schedule-button"
            onClick={() => setShowPoppup(true)}
          >
            Agregar horario
          </button>
          {showPoppup && (
            <PopupAddTurn
              addTurn={addTurn}
              upPopup={showPoppup}
              showPoppupMethod={showPoppupMethod}
            ></PopupAddTurn>
          )}
          <button
            className="btn-sm rounded style-schedule-button"
            onClick={() => setShowPoppupInfo(true)}
          >
            ver info
          </button>
          {showPoppupInfo && (
            <PopupCardInformation
              upPopup={showPoppupInfo}
              showPoppupMethodInfo={showPoppupMethodInfo}
            ></PopupCardInformation>
          )}
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="turn-list-content">
            <h5 className="turn-title">Turnos disponibles</h5>
            <div className="arrow-container">
              <div className="arrow-up"></div>
              <div className="arrow-down"></div>
            </div>
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
                        deleteTurn={deleteTurn}
                        completeTurn={completeTurn}
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
