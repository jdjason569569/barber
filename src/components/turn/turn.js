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
import EmptyList from "../emptyList/emptyList";
import Loader from "../loader/loader";

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
  const [selectCustomer, setSelectCustomer] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user ? setIdFirebaseUser(user.uid) : setIdFirebaseUser(null);
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
        setSearchCustomers(responseCustomersJson);
      } catch (error) {
        //console.error(error);
      }
    };
    getCustomers();
  }, [idFirebaseUser, turnResponse, apiUrl]);

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
    if (turn && method) {
      const responseTurn = await saveTurn(turn, method);
      setTurnResponse(responseTurn);
      toast.success("Agregaste un turno", {
        autoClose: 1000,
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error("Comprueba el numero de telefono!", {
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
    const responseDeleteTurn = await deleteTurn.json();
    const response = {
      value: responseDeleteTurn,
    };
    setTurnResponse(response);
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
    const customer = customers.find((customer) => {
      return customer.name === event.target.value;
    });

    const isValid = turns.find((turn) => {
      return turn.customer.phone === customer.phone;
    });
    if (!isValid) {
      addTurn(customer, "turn");
    } else {
      toast.warning("Ya existe un turno para este cliente", {
        autoClose: 1000,
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };
  const handleInputChange = (event) => {
    //setBusqueda(event.target.value);
    const resultadosFiltrados = customers.filter((customer) =>
      customer.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSearchCustomers(resultadosFiltrados);
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
              onChange={handleInputChange}
              aria-label="First name"
              className="form-control"
            />
          </div>
          <select
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
          </select>
          <button
            onClick={postponeTurns}
            className="btn-sm rounded hold-over-botton"
          >
            Aplazar turnos (10 min)
          </button>
        </div>
        <FormTurn addTurn={addTurn} schedule={false}></FormTurn>
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
                        name={turn.customer.name}
                        turnDate={turn.date_register}
                        order={turn.order}
                        deleteTurn={deleteTurn}
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
