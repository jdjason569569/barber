import { auth } from "../../firebase";

import "./turn.css";
import FormTurn from "./formTurn/formTurn";
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

export default function Turn() {
  const [turns, setTurns] = useState([]);
  const apiUrl = process.env.REACT_APP_API;
  const [isLoading, setIsLoading] = useState(false);
  const [idFirebaseUser, setIdFirebaseUser] = useState(null);
  const [turnResponse, setTurnResponse] = useState(null);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(touchSensor);
  const [customers, setCustomers] = useState([]);
  const [selectCustomer, setSelectCustomer] = useState('');

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
        const responseturnByUser = await fetch(`${apiUrl}/turns/turncustomer`);
        const responseturnByUserJson = await responseturnByUser.json();
        setTurns(responseturnByUserJson);
        setIsLoading(false);
      } catch (error) {
        //console.error(error);
      }
    };
    getturnById();

    const getCustomers = async () => {
      try {
        const responseCutomers = await fetch(`${apiUrl}/customer`);
        const responseCustomersJson = await responseCutomers.json();
        setCustomers(responseCustomersJson);
      } catch (error) {
        //console.error(error);
      }
    };
    getCustomers();
  }, [idFirebaseUser, turnResponse]);

  /**
   * Allow save turn by user
   */
  const saveTurn = async (turn, method) => {
    turn.id_users = await getUserById();
    turn.customer = {
      name: turn.name,
      email: turn.email,
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
    if (turn && method) {
      const responseTurn = await saveTurn(turn, method);
      setTurnResponse(responseTurn);
      toast.success("Agregaste un turno", {
        autoClose: 1000,
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  /**
   * Allow return an user by firebase code
   */
  const getUserById = async () => {
    const respGetUserById = await fetch(`${apiUrl}/user/${idFirebaseUser}`);
    const response = await respGetUserById.json();
    return response.id_users;
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
    toast.error("Eliminaste un turno", {
      autoClose: 1000,
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const handleDragEnd = async (event) => {
    try {
      const { active, over } = event;
      const oldIndex = turns.findIndex((turn) => turn.id === active.id);
      const newIndex = turns.findIndex((turn) => turn.id === over.id);
      const arrayOrder = arrayMove(turns, oldIndex, newIndex);
      if (oldIndex === newIndex) {
        return;
      }
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
                body: JSON.stringify(arrayOrder),
              }
            );
            const responseUpdateTask = updateArray.json();
            setTurnResponse(responseUpdateTask);
            toast.success("Haz movido un turno", {
              autoClose: 1000,
              position: toast.POSITION.TOP_CENTER,
            });
          }
        }
      } else {
        toast.error("No puedes mover un turno de arriba hacia abajo", {
          autoClose: 1000,
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const postponeTurns = async () => {
    if (turns.length > 0) {
      const updateArray = await fetch(`${apiUrl}/turns/postpone`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(turns),
      });
      const responseUpdateTask = updateArray.json();
      setTurnResponse(responseUpdateTask);
      toast.success("Haz movido aplazado todos los turnos 10 minutos", {
        autoClose: 1000,
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error("No tienes turnos que aplazar", {
        autoClose: 1000,
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

 
  const handleChange = (event) => {
    setSelectCustomer(event.target.value);
    const customer = customers.find(customer =>{
      return customer.name === event.target.value;
    });
    addTurn(customer, 'turn');
  };

  return (
    <>
      <ToastContainer />
      {isLoading ? (
        <p>Cargando informacion...</p>
      ) : (
        <div className="container-turn">
          <div>
            <label htmlFor="menu">Seleccionar cliente:</label>
            <select id="menu" value={selectCustomer} onChange={handleChange}>
              <option value="">-- Seleccionar --</option>
              {customers.map((customer) => (
                <option key={customer.id_customer} value={customer.name}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={postponeTurns}
            className="btn-sm rounded hold-over-botton"
          >
            aplazar turnos (10 min)
          </button>
          <div className="style-form">
            <FormTurn addTurn={addTurn}></FormTurn>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="turn-list-content">
              <SortableContext
                items={turns}
                strategy={verticalListSortingStrategy}
              >
                {turns.map((turn) => (
                  <Homeworks
                    key={turn.id}
                    id={turn.id}
                    name={turn.customer.name}
                    turnDate={turn.date_register}
                    order={turn.order}
                    deleteTurn={deleteTurn}
                  />
                ))}
              </SortableContext>
            </div>
          </DndContext>
        </div>
      )}
    </>
  );
}
