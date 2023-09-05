import { auth } from "../../firebase";

import { useState } from "react";
import Formturn from "../turn/formTurn/formTurn";
import { useEffect } from "react";
import "./customer.css";
import { ToastContainer, toast } from "react-toastify";

export default function Customer() {
  const [customerResponse, setCustomerResponse] = useState(null);
  const apiUrl = process.env.REACT_APP_API;
  const [idFirebaseUser, setIdFirebaseUser] = useState(null);
  const [customers, setCustomers] = useState([]);

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
        const responseCutomers = await fetch(`${apiUrl}/customer`);
        const responseCustomersJson = await responseCutomers.json();
        setCustomers(responseCustomersJson);
      } catch (error) {
        //console.error(error);
      }
    };
    getCustomers();
  }, [idFirebaseUser, customerResponse]);

  const addCustomer = async (customer) => {
    if (customer) {
      const responseCustomer = await saveCustomer(customer);
      setCustomerResponse(responseCustomer);
      if (!responseCustomer) {
        toast.error("Ya aexiste un cliente con el email", {
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
        <h4>Clientes</h4>
        {customers.map((customer) => (
          <div className={"customer-container"}>
            <div class="customer-text">
              <h5 class="text-style-name">{customer.name}</h5>
              <p class="text-style-mail">{customer.email}</p>
            </div>
            <div className="icon-container">
              <span class="material-symbols-rounded">settings</span>
              <span class="material-symbols-rounded">delete</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
