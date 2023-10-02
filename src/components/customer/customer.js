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
    const getCustomers = async () => {
      try {
        setIsLoading(true);
        const responseCutomers = await fetch(`${apiUrl}/customer`);
        const responseCustomersJson = await responseCutomers.json();
        setCustomers(responseCustomersJson);
        setIsLoading(false);
      } catch (error) {
        //console.error(error);
      }
    };
    getCustomers();
  }, [idFirebaseUser, customerResponse, apiUrl]);

  const addCustomer = async (customer) => {
    if (customer) {
      const responseCustomer = await saveCustomer(customer);
      setCustomerResponse(responseCustomer);
      if (!responseCustomer) {
        toast.error("Ya aexiste un cliente con el numero", {
          autoClose: 1000,
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.success("Agregaste un cliente", {
          autoClose: 1000,
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
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

  const deleteCustomer = async (id) => {
    try {
      const deleteCustomer = await fetch(`${apiUrl}/customer/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseDeleteCustomer = await deleteCustomer.json();
      const response = {
        value : responseDeleteCustomer
      }
      setCustomerResponse(response);
      if (responseDeleteCustomer.statusCode !== 500) {
        toast.error("Eliminaste un cliente", {
          autoClose: 1000,
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.error(
          "Hubo un error al eliminar un cliente, puede eliminarlo si no tiene turnos asignados",
          {
            autoClose: 5000,
            position: toast.POSITION.TOP_CENTER,
          }
        );
      }
    } catch (error) {
      toast.error(
        "Hubo un error, puede eliminarlo si no tiene turnos asignados",
        {
          autoClose: 1000,
          position: toast.POSITION.TOP_CENTER,
        }
      );
    }
  };

  const getUserById = async () => {
    const respGetUserById = await fetch(`${apiUrl}/user/${idFirebaseUser}`);
    const response = await respGetUserById.json();
    return response.id_users;
  };

  return (
    <>
      <ToastContainer />
      <Formturn addTurn={addCustomer} schedule={true} />
      <div className="customer-list-content">
        <h5 className="customer-title">Clientes</h5>
        { isLoading ? <Loader></Loader> : (<div className="content-customer">
          {customers.length > 0 ? <div className="content-customer">{customers.map((customer) => (
          <div key={customer.id_customer} className={"customer-container"}>
            <div className="customer-text">
              <h5 className="text-style-name">{customer.name}</h5>
              <p className="text-style-mail">{customer.phone}</p>
            </div>
            <div className="icon-container">
              <span className="material-symbols-rounded">settings</span>
              <span
                className="material-symbols-rounded"
                onMouseDown={() => deleteCustomer(customer.id_customer)}
              >
                delete
              </span>
            </div>
          </div>
        ))}
        </div>: <EmptyList text="clientes"></EmptyList> }
        </div>)}
        
      </div>
    </>
  );
}
