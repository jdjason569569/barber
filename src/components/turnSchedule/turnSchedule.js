import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import DatePicker from "react-datepicker";
import ScheduleCard from "./scheduleCard/scheduleCard";
import "react-datepicker/dist/react-datepicker.css";
import "./turnSchedule.css";
import CardInformation from "../modal/cardInformation";

export default function TurnSchedule() {
  const apiUrl = process.env.REACT_APP_API;
  const [startDate, setStartDate] = useState(new Date());
  const [idFirebaseUser, setIdFirebaseUser] = useState(null);
  const [turns, setTurns] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user ? setIdFirebaseUser(user.uid) : setIdFirebaseUser(null);
    });
  }, [apiUrl]);

  useEffect(() => {
    const getturnById = async () => {
      try {
        const idUser = await getUserById();
        if (idUser) {
          const responseturnByUser = await fetch(
            `${apiUrl}/turns/turncustomer/schedule/${idUser}/${encodeURIComponent(
              startDate.toISOString()
            )}`
          );
          const responseturnByUserJson = await responseturnByUser.json();
          setTurns(responseturnByUserJson);
        }
      } catch (error) {
        //console.error(error);
      }
    };
    getturnById();
  }, [apiUrl, idFirebaseUser, startDate]);

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

  return (
    <>
      <div>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
        />
      </div>
      <div className="container-schedule">
        <CardInformation></CardInformation>
      </div>
      <div className="container-turn-schedule">
        {turns.map((turn) => (
          <ScheduleCard turn={turn} />
        ))}
      </div>
    </>
  );
}
