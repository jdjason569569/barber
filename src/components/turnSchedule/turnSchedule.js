import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function TurnSchedule() {

    const [startDate, setStartDate] = useState(new Date());


    return (
      <>
       <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
      </>
    );
  }
  