import "../cardInformation/cardInformation.css";


export default function CardInformation() {

  return (
    <>
          <div className="content">
            <div className="icon-avaliable"></div>
            <div className="information">Cita disponible</div>
          </div>
          <div className="content">
            <div className="icon-cancel"></div>
            <div className="information">Cita cancelada</div>
          </div>
          <div className="content">
            <div className="icon-completed"></div>
            <div className="information">Cita atendida</div>
          </div>
    </>
  );
}
