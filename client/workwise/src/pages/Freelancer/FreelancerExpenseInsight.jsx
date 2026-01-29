import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { getBarChart, getPieChart, getSpecifiedExpenses } from '../../api/freelancerExpense';
import FreelancerExpenseTable from './FreelancerExpenseTable';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2"

const FreelancerExpenseInsight = () => {

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { user } = useAuth();

  const [barAmount, setBarAmount] = useState([]);
  const [barGST, setBarGST] = useState([]);

  const [pieAmount, setPieAmount] = useState([]);
  const [pieGST, setPieGST] = useState([]);

  const [expenseTableData, setExpenseTableData] = useState({
    expenses: [],
    flattenedItems: [],
  });
  const [expenseTableAmount, setExpenseTableAmount] = useState({baseAmount: 0, totalAmount: 0, totalGST: 0 });

  const isMoreThanMonth =
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) > 31;

  useEffect(() => {
  if (!expenseTableData?.expenses?.length) return;

  let baseAmount = 0;
  let totalAmount = 0;
  let totalGST = 0;

  expenseTableData.expenses.forEach(expense => {
    baseAmount += expense.baseAmount || 0;
    totalAmount += expense.totalAmount || 0;
    totalGST += expense.totalGST || 0;
  });

  setExpenseTableAmount({
    baseAmount,
    totalAmount,
    totalGST,
  });
}, [expenseTableData?.expenses]);


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

      const barAmountArray = barRes?.data?.data?.barChartAmount ?? [];
      const barGSTArray = barRes?.data?.data?.barChartGST ?? [];

      const pieAmountArray = pieRes?.data?.data?.pieChartAmount ?? [];
      const pieGSTArray = pieRes?.data?.data?.pieChartGST ?? [];

      if (
        !barAmountArray.length &&
        !barGSTArray.length &&
        !pieAmountArray.length &&
        !pieGSTArray.length
      ) {
        toast.error("Please enter valid dates to fetch expenses");
        return;
      }

      setBarAmount(barAmountArray);
      setBarGST(barGSTArray);
      setPieAmount(pieAmountArray);
      setPieGST(pieGSTArray);
      const expenseData = specifiedExpensesRes?.data?.data;

      setExpenseTableData({
        expenses: expenseData?.expenses ?? [],
        flattenedItems: expenseData?.flattenedItems ?? [],
      });

      toast.success("Charts are Ready!")
    }
    catch (err) {
      console.log("BAR CHART STUDENT ERROR: ", err.response?.data || err.message);
      toast.error("Cannot get charts");
    }
  }


  const getAllAmount = () => {
    
    let baseAmount = 0;
    let totalAmount = 0;
    let totalGST = 0;

    expenseTableData.expenses.forEach(expense => {
      baseAmount += expense.baseAmount;
      totalAmount += expense.totalAmount;
      totalGST += expense.totalGST;
    });

      setExpenseTableAmount({
        baseAmount,
        totalAmount,
        totalGST
      });
  }

  // Options for the chart
  const options = {
    maintainAspectRatio: false,
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

  const barAmountData = {
    labels: barAmount.map((item) => item.label),
    datasets: [
      {
        label: "Amount",
        data: barAmount.map((item) => item.value),
        backgroundColor: generateRandomColors(barAmount.length),
        borderRadius: 6,
        borderColor: "#000000",
        borderWidth:1
      },]
  };


  const barGSTData = {
    labels: barGST.map((item) => item.label),
    datasets: [{
      label: "GST",
      data: barGST.map((item) => item.value),
      backgroundColor: generateRandomColors(barGST.length),
      borderRadius: 6,
      borderColor: "#000000",
      borderWidth:1
    }]
  }

  const pieAmountData = {
    labels: pieAmount.map((item) => item.label),
    datasets: [
      {
        data: pieAmount.map((item) => item.value),
        backgroundColor: generateRandomColors(pieAmount.length),
        borderColor: "#000000",
        borderWidth:1
      },]

  };

  const pieGSTData = {
    labels: pieGST.map((item) => item.label),
    datasets: [
      {
        data: pieGST.map((item) => item.value),
        backgroundColor: generateRandomColors(pieGST.length),
        borderColor: "#000000",
        borderWidth:1
      }]

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
  <div className="flex flex-col gap-6 items-center justify-center mt-4 mb-10 px-2">

    {/* Header + Date Filters */}
    <div className="flex flex-col w-full border lg:w-11/12 p-4 gap-4">
      <div className="text-2xl text-gray-800 space-y-2 font-semibold text-center lg:text-left">
        <p>Hello { user.firstName}!! 🤟</p>
        <p>Smart insights for smarter spending.</p>
      </div>

      <div className="flex flex-col lg:flex-row w-full gap-4">
        <div className="flex flex-col items-start justify-center">
          <label htmlFor="fromDate">From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-[#FFE4CF] rounded-lg p-2 border border-[#2D3C59] w-full"
          />
        </div>

        <div className="flex flex-col items-start justify-center">
          <label htmlFor="toDate">To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-[#FFE4CF] rounded-lg p-2 border border-[#2D3C59] w-full"
          />
        </div>

        <div className="flex items-end justify-start lg:justify-end w-full">
          <button
            className="bg-[#f57e3a] rounded-lg p-3 font-semibold hover:scale-90 transition-all duration-200 w-full lg:w-fit"
            onClick={getCharts}
          >
            View Expenses
          </button>
        </div>
      </div>
    </div>

    {/* Charts */}
    <div className="flex flex-col gap-12 items-center justify-center mt-10 w-full">

      {barAmount.length > 0 && (
        <p className="text-gray-800 font-semibold text-2xl text-center">
          A clear view of where your money goes...
        </p>
      )}

      {/* Amount Charts */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-40 w-full">
        {barAmount.length > 0 && (
          <div className="h-96 w-full max-w-[24rem] text-center space-y-2">
            <Bar data={barAmountData} options={options} />
            <p>{isMoreThanMonth ? "Amount vs. Month" : "Amount vs. Items"}</p>
          </div>
        )}

        {pieAmount.length > 0 && (
          <div className="h-96 w-full max-w-[24rem] text-center space-y-2">
            <Pie data={pieAmountData} />
            <p>{isMoreThanMonth ? "Amount vs. Month" : "Amount vs. Items"}</p>
          </div>
        )}
      </div>

      {/* GST Charts */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-40 w-full">
        {pieGST.length > 0 && (
          <div className="h-96 w-full max-w-[24rem] text-center space-y-2">
            <Pie data={pieGSTData} />
            <p>GST Amount Per Item</p>
          </div>
        )}

        {barGST.length > 0 && (
          <div className="h-96 w-full max-w-[24rem] text-center space-y-2">
            <Bar data={barGSTData} options={options} />
            <p>{isMoreThanMonth ? "GST vs. Month" : "GST vs. Items"}</p>
          </div>
        )}
      </div>

      {/* Table */}
      {expenseTableData.flattenedItems.length > 0 && (
        <div className="w-10/12 text-center mt-10">
          <p className="text-gray-800 font-semibold text-2xl mb-4">
            Know your numbers...
          </p>
          <FreelancerExpenseTable
            expenseTableData={expenseTableData.flattenedItems}
            expenseTableAmount={expenseTableAmount}
          />
        </div>
      )}
    </div>

    <footer className="text-sm text-gray-500 text-center mt-10">
      © 2026 WorkWise. All rights reserved.
    </footer>
  </div>
);

}

export default FreelancerExpenseInsight
