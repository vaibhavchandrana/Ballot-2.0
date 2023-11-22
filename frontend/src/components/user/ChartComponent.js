import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const ChartComponent = ({ data }) => {
  const [seriesColumn, setSeriesColumn] = useState(
    data.map((item) => item.no_of_votes)
  );
  const [optionsColumn, setOptionsColumn] = useState({
    chart: {
      type: "bar",
      height: 350,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        distributed: true,
      },
    },
    colors: ["#369395", "#DF7F69", "#7DDE6B", "#55D618", "#53CCF6"],
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: data.map((item) => item.name.toUpperCase()),
    },
  });

  const [seriesDonut, setSeriesDonut] = useState(
    data.map((item) => item.no_of_votes)
  );
  const [optionsDonut, setOptionsDonut] = useState({
    chart: {
      type: "donut",
    },
    legend: {
      position: "bottom",
    },

    labels: data.map((item) => item.name.toUpperCase()),
  });

  return (
    <div className="row d-flex justify-content-center">
      <div id="chart" className="col-12 col-md-5 border-2">
        <ReactApexChart
          options={optionsColumn}
          series={[{ data: seriesColumn }]}
          type="bar"
          height={350}
        />
      </div>
      <div id="chart" className="col-12 col-md-5">
        <ReactApexChart
          options={optionsDonut}
          series={seriesDonut}
          type="donut"
          height={350}
        />
      </div>
    </div>
  );
};

export default ChartComponent;
