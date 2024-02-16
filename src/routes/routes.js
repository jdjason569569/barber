import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth } from "../firebase";
import { useEffect, useState } from "react";

import Login from "../components/login/login";
import SignUp from "../components/signUp/signUp";
import Home from "../components/home/home";
import { ProtectedRoute } from "../components/shared/protectedRoute";

export function MyRoutes() {
  const [user, setUser] = useState("holamundo");

  useEffect(() => {
    const authenticate = async () => {
      await auth.onAuthStateChanged((user) => {
        user ? setUser(user.uid) : setUser(null);
      });
    };

    authenticate();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route element={<ProtectedRoute name={user} />}>
          <Route exact path="/home" element={<Home user={user} />}></Route>
        </Route>
        <Route exact path="/signup" element={<SignUp />}></Route>
        <Route path="*" element={<Login />}></Route>
      </Routes>
    </Router>
  );
}
