import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const ReversedBarChart = React.memo(({ data }) => {
  const chartData = {
    // labels: data.map((item) => item.label),
    datasets: [
      {
        label: 'Ratings',
        data: data.map((item) => item.value),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        fill: true,
        tension: 0.3, 
        pointRadius: 0, 
      },
      {
        label: 'Another Metric',
        data: data.map((item) => item.value * 1.5),
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        type: 'linear',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Values',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Labels',
        },
      },
    },
    animations: false,
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
});

export default ReversedBarChart;
