import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "./lines.chart.css";

export default function LinesChart({ allMoney }) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );

  if (allMoney) {
    let money = [];
    let dias = [];
    let currentDate = new Date();
    let año = 0;
    let mes = 0;

    if (process.env.REACT_APP_ZONE === "0") {
      año = currentDate.getUTCFullYear();
      mes = currentDate.getUTCMonth();
    } else {
      año = currentDate.getFullYear();
      mes = currentDate.getMonth() + 1;
    }

    var diasMes = new Date(año, mes, 0).getDate();

    for (let i = 1; i <= diasMes; i++) {
      money.push(0);
      dias.push(i);
    }

    for (let i = 0; i < allMoney.length; i++) {
      const index = dias.indexOf(allMoney[i].dia);
      if (index !== -1) {
        money[index] = allMoney[i].total_price
      }
    }

    var beneficios = money;
    var meses = dias;
  }

  var midata = {
    labels: meses,
    datasets: [
      // Cada una de las líneas del gráfico
      {
        label: "Ganancias por dias atendidos",
        data: beneficios,
        tension: 0.5,
        fill: true,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        pointRadius: 5,
        pointBorderColor: "rgba(255, 99, 132)",
        pointBackgroundColor: "rgba(255, 99, 132)",
      },
    ],
  };

  var misoptions = {
    scales: {
      y: {
        min: 0,
      },
      x: {
        ticks: { color: "rgb(255, 99, 132)" },
      },
    },
  };

  return <Line data={midata} options={misoptions} />;
}
