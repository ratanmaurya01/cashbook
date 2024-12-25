import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ActivityTracker = () => {
  const [usageData, setUsageData] = useState([]);
  const recordActivity = () => {
    const currentDate = new Date().toLocaleDateString();
    let activityData = JSON.parse(localStorage.getItem("activityData")) || [];
    const todayData = activityData.find(item => item.date === currentDate);
    if (todayData) {
      todayData.count += 1;
    } else {
      activityData.push({ date: currentDate, count: 1 });
    }
    localStorage.setItem("activityData", JSON.stringify(activityData));
    setUsageData(activityData);
  };
  useEffect(() => {
    const activityData = JSON.parse(localStorage.getItem("activityData")) || [];
    setUsageData(activityData);
  }, []);
  const graphData = {
    labels: usageData.map(item => item.date),
    datasets: [
      {
        label: "Usage Count",
        data: usageData.map(item => item.count),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };
  
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-blue-50 to-blue-100 min-w-[300px] shadow-xl rounded-lg mx-auto p-2 w-full sm:max-w-md md:max-w-lg lg:w-1/2 xl:w-1/2 !important"
      >
        <button onClick={recordActivity}>Record Activity</button>
        <h2>Daily Activity Tracker</h2>
        <Line data={graphData} />

      </motion.div>

    </div>
  );
};

export default ActivityTracker;
