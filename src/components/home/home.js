import '../home/home.css';

import { auth } from "../../firebase";
import { useNavigate } from 'react-router-dom';
import Turn from '../turn/turn';


/**
 * Component that gives input to the application
 */

export default function Home({ name }) {
    const navigate = useNavigate();
    
    const exit = () => {
        navigate("/");
        return auth.signOut();
    }
    return (
        <>
            <div className="container-home">
                <div>
                    <h2>{name ? `Bienvenido  ${name}` : "Inicia session"}</h2>
                </div>
                <div>
                    {name && <button className="btn-sm rounded turn-botton" onClick={exit}>Salir</button>}
                </div>
            </div>
            <div>
            <Turn></Turn>
            </div>
        </>
    )
}