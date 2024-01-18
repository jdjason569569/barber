import "./scheduleCard.css";

export default function ScheduleCard({ turn }) {
  return (
    <>
      <div
        className={
          turn.completed
            ? "turn-container turn-container-completed"
            : "turn-container"
        }
      >
        <div className="text-style" style={{ marginLeft: "5%" }}>
          {turn.order}
        </div>
        <div className="turn-text text-style">{turn.customer.name}</div>
        
      </div>

    </>
  );
}
