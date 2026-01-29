import React, { use, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getBarChart, getPieChart, getSpecifiedExpenses } from '../../api/studentExpense';
import StudentExpenseTable from './StudentExpenseTable';
import { useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js"
import { Pie, Bar } from "react-chartjs-2"

const StudentExpenseInsight = () => {

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { user } = useAuth();
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [expenseTableData, setExpenseTableData] = useState([]);
    const isMoreThanMonth =
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) > 31;


  const getCharts = async () => {

    try {
      const role = user.role.toLowerCase();
      if (startDate === "" || endDate === "") {
        toast.error("Please provide both the dates");
        return null;
      }

      if (startDate > endDate) {
        toast.error("Please enter valid dates");
        return null;
      }

      const [
        barRes,
        pieRes,
        specifiedExpensesRes,
      ] = await Promise.all([
        getBarChart(role, { startDate, endDate }),
        getPieChart(role, { startDate, endDate }),
        getSpecifiedExpenses(role, { startDate, endDate }),
      ]);

      const barArray = barRes?.data?.data?.barChartAmount ?? [];
      const pieArray = pieRes?.data?.data ?? [];
      const expenseArray = specifiedExpensesRes?.data?.data ?? [];


      if (!barArray.length && !pieArray.length && !expenseArray.length) {
        toast.error("Please enter valid dates to fetch expenses");
        return;
      }

      setBarData(barArray);
      setPieData(pieArray);
      setExpenseTableData(expenseArray);


      toast.success("Charts are Ready!")
    }
    catch (err) {
      console.log("BAR CHART STUDENT ERROR: ", err.response?.data || err.message);
      toast.error("Cannot get charts");
    }
  }

  // Function to generate random colors for the chart
  const generateRandomColors = (numColors) => {
    const colors = []
    for (let i = 0; i < numColors; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`
      colors.push(color)
    }
    return colors
  }


  // Options for the chart
  const options = {
    maintainAspectRatio: false,
  }

  
  const barChartData = {
    labels: barData.map((item) => item.label),
    datasets: [
      {
        label: "Total Expense",
        data: barData.map((item) => Number(item.value)),
        backgroundColor: generateRandomColors(barData.length),
        borderRadius: 6,
        borderColor: "#1f2937",
        borderWidth:1
      },
    ],
  };

  const pieChartData = {
    labels: pieData.map((item) => item.label),
    datasets: [
      {
        data: pieData.map((item) => Number(item.value)),
        backgroundColor: generateRandomColors(pieData.length),
        borderColor: "#1f2937",
        borderWidth:1
      },
    ],
  };

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
  );

return (
  <div className="flex items-center justify-center mt-4 flex-col px-2">
    {/* Header */}
    <div className="flex flex-col w-full border lg:w-11/12 p-4">
      <div className="text-2xl text-gray-800 space-y-2 font-semibold">
        <p>Hello { user.firstName}!! 🤟</p>
        <p>Smart insights for smarter spending.</p>
      </div>

      {/* Date filters */}
      <div className="flex flex-col sm:flex-row w-full gap-4 mt-2">
        <div className="flex flex-col items-start justify-center p-2">
          <label htmlFor="fromDate">From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-[#FFE4CF] rounded-lg p-2 border border-[#2D3C59] w-full sm:w-auto"
          />
        </div>

        <div className="flex flex-col items-start justify-center p-2">
          <label htmlFor="toDate">To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-[#FFE4CF] rounded-lg p-2 border border-[#2D3C59] w-full sm:w-auto"
          />
        </div>

        <div className="flex justify-start sm:justify-end items-end p-2 w-full">
          <button
            className="bg-[#f57e3a] rounded-lg p-3 font-semibold hover:scale-90 transition-all duration-200 w-full sm:w-auto"
            onClick={getCharts}
          >
            View Expenses
          </button>
        </div>
      </div>
    </div>

    {/* Charts */}
    <div className="flex flex-col items-center justify-center gap-10 mt-6 mb-10 w-full">
      {barData.length > 0 && pieData.length > 0 && (
        <p className="text-gray-800 font-semibold text-2xl mt-4 text-center">
          A clear view of where your money goes...
        </p>
      )}

      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-64 w-full">
        {/* Bar chart */}
        {barData.length > 0 && (
          <div className="h-96 w-full max-w-sm text-center">
            <Bar data={barChartData} options={options} />
            <p className="mt-2">
              {isMoreThanMonth ? "Amount vs. Month" : "Amount vs. Items"}
            </p>
          </div>
        )}

        {/* Pie chart */}
        {pieData.length > 0 && (
          <div className="h-96 w-full max-w-sm text-center">
            <Pie data={pieChartData} />
            <p className="mt-2">Amount per Item</p>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="w-11/12 text-center">
        {barData.length > 0 && pieData.length > 0 && (
          <>
            <p className="text-gray-800 font-semibold text-2xl mt-4">
              Know your numbers...
            </p>
            <StudentExpenseTable expenseTableData={expenseTableData} />
          </>
        )}
      </div>
    </div>

    <footer className="text-sm text-gray-500 mb-6 text-center">
      © 2026 WorkWise. All rights reserved.
    </footer>
  </div>
);

}

export default StudentExpenseInsight
