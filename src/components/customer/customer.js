import { auth } from "../../firebase";

import { useState } from "react";
import Formturn from "../turn/formTurn/formTurn";
import { useEffect } from "react";
import "./customer.css";
import { ToastContainer, toast } from "react-toastify";
import EmptyList from "../emptyList/emptyList";
import Loader from "../loader/loader";

export default function Customer() {
  const [customerResponse, setCustomerResponse] = useState(null);
  const apiUrl = process.env.REACT_APP_API;
  const [idFirebaseUser, setIdFirebaseUser] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user ? setIdFirebaseUser(user.uid) : setIdFirebaseUser(null);
    });
  }, [apiUrl]);

  useEffect(() => {
    const getCustomers = async () => {
      try {
        setIsLoading(true);
        const idUser = await getUserById();
        if (idUser) {
          const responseCutomers = await fetch(
            `${apiUrl}/customer/byuser/${idUser}`
          );
          const responseCustomersJson  = await responseCutomers.json();
          setCustomers(responseCustomersJson);
          setIsLoading(false);
        } else{
          setIsLoading(false);
        }
      } catch (error) {
        //console.error(error);
      }
    };
    getCustomers();
  }, [idFirebaseUser, customerResponse, apiUrl]);

  let addCustomer = async (customer) => {
    if (customer) {
      let responseCustomer = null;
      if (customer.id_customer) {
        responseCustomer = await updateCustomer(customer);
        setCustomerResponse(responseCustomer);
        !responseCustomer
          ? toast.error("Error al actualizar un cliente", {
              autoClose: 1000,
              position: toast.POSITION.TOP_CENTER,
            })
          : toast.success("Actualizaste un cliente", {
              autoClose: 1000,
              position: toast.POSITION.TOP_CENTER,
            });
        setCustomer(null);
      } else {
        responseCustomer = await saveCustomer(customer);
        setCustomerResponse(responseCustomer);
        !responseCustomer
          ? toast.error("Ya aexiste un cliente con el numero", {
              autoClose: 1000,
              position: toast.POSITION.TOP_CENTER,
            })
          : toast.success("Agregaste un cliente", {
              autoClose: 1000,
              position: toast.POSITION.TOP_CENTER,
            });
      }
    }
  };

  const editCustomer = (customer) => {
    setCustomer(customer);
  };

  const saveCustomer = async (customer) => {
    customer.user = await getUserById();
    const responseAddTurn = await fetch(`${apiUrl}/customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customer),
    });
    return await responseAddTurn.json();
  };

  const updateCustomer = async (customer) => {
    const id = customer.id_customer;
    const responseUpateTurn = await fetch(`${apiUrl}/customer/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customer),
    });
    return await responseUpateTurn.json();
  };

  const disableCustomer = async (customer) => {
    const id = customer.id_customer;
    const responseDisableCustomer = await fetch(
      `${apiUrl}/customer/disable/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
      }
    );
    if (responseDisableCustomer) {
      setCustomerResponse(responseDisableCustomer);
    }
  };

  // const deleteCustomer = async (id) => {
  //   try {
  //     const deleteCustomer = await fetch(`${apiUrl}/customer/${id}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const responseDeleteCustomer = await deleteCustomer.json();
  //     const response = {
  //       value: responseDeleteCustomer,
  //     };
  //     setCustomerResponse(response);
  //     responseDeleteCustomer.statusCode !== 500
  //       ? toast.error("Eliminaste un cliente", {
  //           autoClose: 1000,
  //           position: toast.POSITION.TOP_CENTER,
  //         })
  //       : toast.error(
  //           "Hubo un error al eliminar un cliente, puede eliminarlo si no tiene turnos asignados",
  //           {
  //             autoClose: 5000,
  //             position: toast.POSITION.TOP_CENTER,
  //           }
  //         );
  //   } catch (error) {
  //     toast.error(
  //       "Hubo un error, puede eliminarlo si no tiene turnos asignados",
  //       {
  //         autoClose: 1000,
  //         position: toast.POSITION.TOP_CENTER,
  //       }
  //     );
  //   }
  // };

  const getUserById = async () => {
    try {
      const respGetUserById = await fetch(`${apiUrl}/user/${idFirebaseUser}`);
      const response = await respGetUserById.json();
      return response.id_users;
    } catch (error) {
      return null;
    }
  };

  return (
    <>
      <ToastContainer />
      <Formturn addTurn={addCustomer} customer={customer} schedule={true} />
      <div className="customer-list-content">
        <h5 className="customer-title">Clientes</h5>
        {isLoading ? (
          <Loader></Loader>
        ) : (
          <div className="content-customer">
            {customers.length > 0 ? (
              <div className="content-customer">
                {customers.map((customer) => (
                  <div
                    key={customer.id_customer}
                    className={"customer-container"}
                  >
                    <div className="customer-text">
                      <h5 className="text-style-name">{customer.name}</h5>
                      <p className="text-style-mail">{customer.phone}</p>
                    </div>
                    <div className="icon-container">
                      <span
                        className="material-symbols-rounded style-bottom"
                        onMouseDown={() => editCustomer(customer)}
                      >
                        edit
                      </span>
                      <span
                        className="material-symbols-rounded style-bottom"
                        onMouseDown={() => disableCustomer(customer)}
                      >
                        delete
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyList text="clientes"></EmptyList>
            )}
          </div>
        )}
      </div>
    </>
  );
}
