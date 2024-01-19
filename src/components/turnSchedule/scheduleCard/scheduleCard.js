import "./scheduleCard.css";

export default function ScheduleCard({ turn }) {
  return (
    <>
      <div
        className={
          turn.completed
            ? "turn-container turn-container-completed"
            :  turn.disable ?  "turn-container turn-container-cancel" : "turn-container"
        }
      >
        <div className="turn-text text-style">{turn.customer.name}</div>
        
      </div>

    </>
  );
}
