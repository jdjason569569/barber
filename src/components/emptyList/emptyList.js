import "./emptyList.css";

export default function EmptyList({ text }) {
  return (
    <div className="container-empty-list">
      <div>
        <span className="material-symbols-rounded">
          <span class="material-symbols-rounded style-icon">hourglass_empty</span>
        </span>
      </div>
      <div className="text-empty">No hay {text} aun!</div>
    </div>
  );
}
