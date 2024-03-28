import { useState, useEffect } from "react";
import { auth } from "../../../firebase";
import { Modal, ModalBody } from "reactstrap";
import "./chart.modal.css";
import Loader from "../../loader/loader";
import LinesChart from "../../charts/lines.chart";
export default function ChartModal({ upPopup, showChartMethod }) {
  const [customerTimes, setCustomerTimes] = useState([]);
  const [idFirebaseUser, setIdFirebaseUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API;
  const [allMoney, setAllMoney] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user ? setIdFirebaseUser(user.uid) : setIdFirebaseUser(null);
    });
  }, [apiUrl]);

  useEffect(() => {
    const searchMoneyAllDay = async () => {
      const idUser = await getUserById();
      if (idUser !== null) {
        const responseCutomers = await fetch(
          `${apiUrl}/statistics/moneyAllDaySchedule/${idUser}`
        );
        const response = await responseCutomers.json();
        setAllMoney(response);
      }
    };
    searchMoneyAllDay();
  }, [apiUrl, idFirebaseUser]);

  /**
   * Allow return an user by firebase code
   */
  const getUserById = async () => {
    try {
      const respGetUserById = await fetch(`${apiUrl}/user/${idFirebaseUser}`);
      const response = await respGetUserById.json();
      return response.id_users;
    } catch (error) {
      return null;
    }
  };

  const showPoPup = (value) => {
    return showChartMethod(value);
  };

  return (
    <>
      <Modal isOpen={upPopup}>
        <ModalBody >
          <div >
            {allMoney.length > 0 && (
              <div >
                <LinesChart allMoney={allMoney}></LinesChart>
              </div>
            )}

            <button
              className="btn-sm rounded cancel-turn"
              onMouseDown={() => showPoPup(false)}
            >
              Cerrar
            </button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
