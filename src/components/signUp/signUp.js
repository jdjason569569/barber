import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { InputControl } from "../shared/inputControl/inputControl";
import "../signUp/signUp.css";
import { ToastContainer } from "react-toastify";

export default function SignUp() {
  const apiUrl = process.env.REACT_APP_API;
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    pass: "",
    session: "",
  });
  const [name, setName] = useState(null);
  const [error, setError] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user ? setName(user.email) : setName(null);
    }, []);
  });

  const register = async () => {
    if (!values.name || !values.email || !values.pass) {
      setError("Diligencie todos los campos");
      return;
    }
    try {
      const responseRegister = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.pass
      );
      const user = responseRegister.user;
      await updateProfile(user, {
        displayName: values.name,
      });

      if (responseRegister && apiUrl) {
        const userObject = {};
        userObject.id_firebase = user.uid;
        userObject.email = values.email;
        userObject.config = {
          sessions: values.session,
        };
        const response = await fetch(`${apiUrl}/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userObject),
        });
        if (response) {
          auth.signOut();
          navigate("/");
        }
      }
    } catch (error) {
       console.log(error);
    }
  };

  return (
    <div className={name ? "container-signup" : "container-signup-only"}>
      <ToastContainer />
      <h1 className="">Registro</h1>
      <div className="signup-form">
        <InputControl
          placeholder="Nombre"
          onChange={(event) =>
            setValues((prev) => ({ ...prev, name: event.target.value }))
          }
        />
      </div>
      <div className="signup-form">
        <InputControl
          placeholder="Email"
          onChange={(event) =>
            setValues((prev) => ({ ...prev, email: event.target.value }))
          }
        />
      </div>
      <div className="signup-form">
        <InputControl
          placeholder="Password"
          onChange={(event) =>
            setValues((prev) => ({ ...prev, pass: event.target.value }))
          }
        />
      </div>
      <div className="signup-form">
        <InputControl
          placeholder="Sesiones"
          type={"number"}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, session: event.target.value }))
          }
        />
      </div>
      <div>
        <b>{error}</b>
        <button
          onClick={register}
          className="btn btn-light btn-sm rounded btn-style"
        >
          Guardar
        </button>
        {!name && (
          <p className="p_style">
            Si ya tienes una cuenta
            <span style={{ marginLeft: "5px" }}>
              <Link to="/">Login</Link>
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
