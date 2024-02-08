import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth } from "../firebase";
import { useEffect, useState } from "react";

import Login from "../components/login/login";
import SignUp from "../components/signUp/signUp";
import Home from "../components/home/home";
import { ProtectedRoute } from "../components/shared/protectedRoute";

export function MyRoutes() {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user ? setUserName(user.displayName) : setUserName(null);
    });
  });

  return (
    <Router>
      <Routes>
        <Route exact path="/home" element={<Home name={userName} />}></Route>
        <Route path="/" element={<Login />}></Route>

        <Route exact path="/signup" element={<SignUp />}></Route>
        <Route path="*" element={<Login />}></Route>
      </Routes>
    </Router>
  );
}
