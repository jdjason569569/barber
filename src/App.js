
import './App.css';
import { MyRoutes } from './routes/routes';

function App() {
  useEffect(() => {
    // Agrega un listener para el evento de desplazamiento (scroll)
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Limpia el listener cuando el componente se desmonta
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);
  const handleTouchMove = (e) => {
    // Evitar el comportamiento predeterminado del navegador
    e.preventDefault();
  };
  return (
    <div className="App">
      <MyRoutes />
    </div>
  );
}

export default App;
