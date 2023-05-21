import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from "../firebase";
import { useEffect, useState } from 'react';

import Login from '../components/login/login';
import SignUp from '../components/signUp/signUp';



export function MyRoutes() {

    const [userName, setUserName] = useState(null);
    
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setUserName(user.displayName);
            } else {
                setUserName(null);
            }
        }); 
    });

    return (
         <Router>
             <Routes>
                 <Route exact path='/' element={<Login />}></Route>
                 <Route exact path='/signup'  element={<SignUp />}></Route>
             </Routes>
         </Router>
    );
}

