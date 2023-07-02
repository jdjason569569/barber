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
      }else{
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
      <Formturn addTurn={addCustomer} />
      {customers.map((customer) => (
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{customer.name}</h5>
            <p class="card-text">{customer.email}</p>
          </div>
        </div>
      ))}
    </>
  );
}
