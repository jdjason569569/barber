import "../cardInformation/cardInformation.css";


export default function CardInformation() {

  return (
    <>
          <div className="content">
            <div className="icon-avaliable"></div>
            <div className="information">Turno sin atender</div>
          </div>
          <div className="content">
            <div className="icon-cancel"></div>
            <div className="information">Turno cancelada</div>
          </div>
          <div className="content">
            <div className="icon-completed"></div>
            <div className="information">Turno atendida</div>
          </div>
    </>
  );
}
