import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";

import { InputControl } from "../shared/inputControl/inputControl";
import "../login/login.css";
import logo from "../../assets/barber.jpg";
import { ToastContainer, toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const apiUrl = process.env.REACT_APP_API;

  const [values, setValues] = useState({
    email: "",
    pass: "",
  });

  useEffect(() => {
    const path = localStorage.getItem("path");
    if (path) {
      navigate("/home");
    }
  }, []);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const authUser = async () => {
    values.email = values.email+"@gmail.com"
    if (!values.email || !values.pass) {
      toast.error("Datos incompletos");
      return;
    }
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.pass
      );

      if (response) {
        const increase = {
          increaseVar: true,
        };
        const respGetUserById = await fetch(
          `${apiUrl}/user/${response.user.uid}`
        );
        const responseJson = await respGetUserById.json();
        if (responseJson) {
          const responsUser = await fetch(
            `${apiUrl}/user/${responseJson.id_users}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(increase),
            }
          );
          const reponseUserJson = await responsUser.json();
          if (reponseUserJson.status === "error") {
            toast.warn(reponseUserJson.message);
          } else {
            if(isChecked){
              localStorage.setItem("invited", isChecked);
            }
            localStorage.setItem("path", "/home");
            navigate("/home");
          }
        }
      }
    } catch (error) {
      navigate("/");
      toast.error(error.message);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <ToastContainer position="bottom-center" autoClose={3000} />
      <div style={{ marginTop: "200px" }} className="container">
        <div className="login-form">
          <div className="image-container">
            <img className="image" src={logo} />
          </div>
          <div className="form-group">
            <InputControl
              type="text"
              placeholder="Tu correo"
              onChange={(event) => {
                setValues({ ...values, email: event.target.value });
              }}
            ></InputControl>
          </div>
          <div className="form-group">
            <InputControl
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              onChange={(event) => {
                setValues({ ...values, pass: event.target.value });
              }}
            ></InputControl>
            <button
              className="btn btn-light btn-sm btn-pass"
              onClick={togglePassword}
            >
              <span className="bi bi-eye-fill"></span>
            </button>
          </div>
          <div className="form-group">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <label>{isChecked ? "Invitado" : ""}</label>
          </div>
          <button
            type="submit"
            onClick={authUser}
            className="btn btn-light btn-sm rounded btn-style"
          >
            Iniciar sesión
          </button>
          <div>
            <Link to="/signup" className="create-font">
              Crear cuenta
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
