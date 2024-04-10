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
  const invited = JSON.parse(localStorage.getItem("invited"));
  const [inputValueSearch, setInputValueSearch] = useState("");
  const [searchCustomers, setSearchCustomers] = useState(customers);

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
          const responseCustomersJson = await responseCutomers.json();
          setCustomers(responseCustomersJson);
          setSearchCustomers(responseCustomersJson);
          setIsLoading(false);
        } else {
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
      /**TODO response from server*/
      let responseCustomer = null;
      if (customer.id_customer) {
        responseCustomer = await updateCustomer(customer);
        setCustomerResponse(responseCustomer);
        !responseCustomer
          ? toast.error("Error al actualizar un cliente")
          : toast.success("Actualizaste un cliente");
        setCustomer(null);
      } else {
        responseCustomer = await saveCustomer(customer);
        setCustomerResponse(responseCustomer);
        switch (responseCustomer.status) {
          case "success":
            toast.success(responseCustomer.message);
            break;
          case "error":
            toast.warn(responseCustomer.message);
            break;
        }
      }
    }
  };

  const editCustomer = (customer) => {
    setCustomer(customer);
    toast.success("Ya puedes editar un cliente");
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

  const getUserById = async () => {
    try {
      const respGetUserById = await fetch(`${apiUrl}/user/${idFirebaseUser}`);
      const response = await respGetUserById.json();
      return response.id_users;
    } catch (error) {
      return null;
    }
  };

  const handleInputChange = (event) => {
    setInputValueSearch(event.target.value.toLowerCase());
    const filterResult = customers.filter((customer) => {
      return (
        customer.name
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        customer.phone.includes(event.target.value.toLowerCase())
      );
    });
    setSearchCustomers(filterResult);
  };

  return (
    <>
      <ToastContainer position="bottom-center" autoClose={3000} />
      <Formturn addTurn={addCustomer} customer={customer} schedule={true} />
      <div className="container-search-customer">
        <div className="input-group-add-customer">
          <span className="title-client-add-customer">Buscar</span>
          <input
            type="text"
            value={inputValueSearch}
            onChange={handleInputChange}
            aria-label="First name"
            className="form-control"
          />
        </div>
      </div>
      <div className="customer-list-content">
        <h5 className="customer-title">Clientes</h5>
        {isLoading ? (
          <Loader></Loader>
        ) : (
          <div className="content-customer">
            {searchCustomers.length > 0 ? (
              <div>
                {searchCustomers.map((customer) => (
                  <div
                    key={customer.id_customer}
                    className={"customer-container"}
                  >
                    <div className="customer-text">
                      <h5 className="text-style-name">{customer.name}</h5>
                      {!invited ? (
                        <p className="text-style-mail">{customer.phone}</p>
                      ) : null}
                    </div>
                    {!invited ? (
                      <div className="icon-container">
                        <button
                          className="material-symbols-rounded style-bottom-customer"
                          onMouseDown={() => editCustomer(customer)}
                        >
                          edit
                        </button>
                        {/* <button
                        className="material-symbols-rounded style-bottom-customer"
                        onMouseDown={() => disableCustomer(customer)}
                      >
                        delete
                      </button> */}
                      </div>
                    ) : null}
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
