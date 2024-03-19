import "../cardInformation/cardInformation.css";

export default function CardInformation({ money }) {
  console.log(money)
  return (
    <>
      <div className="content-information">
        <div className="card-info">
          <div className="information">
            <div className="icon-avaliable"></div>
            <div className="info">Sin atender</div>
          </div>
          <div className="information">
            <div className="icon-cancel"></div>
            <div className="info">Cancelado</div>
          </div>
          <div className="information">
            <div className="icon-completed"></div>
            <div className="info">Atendido</div>
          </div>
        </div>
        <div className="earnings">
          {money.length > 0 ?
            money.map((m) => <div key={m.id_users}> {m.total} pesos</div>) : "No tienes ganancias"}
        </div>
      </div>
    </>
  );
}
