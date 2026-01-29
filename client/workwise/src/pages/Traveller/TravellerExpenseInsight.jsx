import React from 'react'
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
import { useState } from 'react';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { getSpecifiedExpenses, getBarChart, getPieChart } from '../../api/travellerExpense';
import TravellerExpenseTable from './TravellerExpenseTable';

const TravellerExpenseInsight = () => {
    const currencies = [
        "INR", "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT",
        "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL", "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF",
        "CHF", "CLF", "CLP", "CNH", "CNY", "COP", "CRC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD",
        "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "FOK", "GBP", "GEL", "GGP", "GHS", "GIP", "GMD", "GNF",
        "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "IMP", "IQD", "IRR", "ISK", "JEP",
        "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KID", "KMF", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP",
        "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRU", "MUR", "MVR",
        "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK",
        "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK",
        "SGD", "SHP", "SLE", "SLL", "SOS", "SRD", "SSP", "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND",
        "TOP", "TRY", "TTD", "TVD", "TWD", "TZS", "UAH", "UGX", "USD", "UYU", "UZS", "VES", "VND", "VUV",
        "WST", "XAF", "XCD", "XCG", "XDR", "XOF", "XPF", "YER", "ZAR", "ZMW", "ZWG", "ZWL"
    ];

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currency, setCurrency] = useState("INR");
    const { user } = useAuth();
    const isMoreThanMonth =
        (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) > 31;

    const [barAmount, setBarAmount] = useState([]);
    const [barOther, setBarOther] = useState([]);

    const [pieAmount, setPieAmount] = useState([]);
    const [pieOther, setPieOther] = useState([]);

    const [expenseTableData, setExpenseTableData] = useState([]);

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
            toast.loading("Loading...")
            const [
                barRes,
                pieRes,
                specifiedExpensesRes,
            ] = await Promise.all([
                getBarChart(role, { startDate, endDate, currency }),
                getPieChart(role, { startDate, endDate, currency }),
                getSpecifiedExpenses(role, { startDate, endDate }),
            ]);


            const barAmountArray = barRes?.data?.data?.barChartINR ?? [];
            const barOtherArray = barRes?.data?.data?.barChartOther ?? [];

            const pieAmountArray = pieRes?.data?.data?.pieINR ?? [];
            const pieOtherArray = pieRes?.data?.data?.pieOther ?? [];

            if (
                !barAmountArray.length &&
                !barOtherArray.length &&
                !pieAmountArray.length &&
                !pieOtherArray.length
            ) {
                toast.error("Please enter valid dates to fetch expenses");
                return;
            }

            setBarAmount(barAmountArray);
            setBarOther(barOtherArray);
            setPieAmount(pieAmountArray);
            setPieOther(pieOtherArray);
            setExpenseTableData(specifiedExpensesRes.data.data);
            toast.dismiss();
            toast.success("Charts are Ready!")
        }
        catch (err) {
            console.log("BAR CHART STUDENT ERROR: ", err.response?.data || err.message);
            toast.error("Cannot get charts");
        }
    }

    const options = {
        maintainAspectRatio: false,
        responsive: true
    }

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
                borderWidth: 1
            },]
    };

    const barOtherData = {
        labels: barOther.map((item) => item.label),
        datasets: [{
            label: currency,
            data: barOther.map((item) => item.value),
            backgroundColor: generateRandomColors(barOther.length),
            borderRadius: 6,
            borderColor: "#000000",
            borderWidth: 1
        }]
    }

    const pieAmountData = {
        labels: pieAmount.map((item) => item.label),
        datasets: [
            {
                data: pieAmount.map((item) => item.value),
                backgroundColor: generateRandomColors(pieAmount.length),
                borderColor: "#000000",
                borderWidth: 1
            },]
    };

    const pieOtherData = {
        labels: pieOther.map((item) => item.label),
        datasets: [
            {
                data: pieOther.map((item) => item.value),
                backgroundColor: generateRandomColors(pieOther.length),
                borderColor: "#000000",
                borderWidth: 1
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
        <div className="flex flex-col items-center justify-center mt-4 mb-10 px-3">
            <div className="flex flex-col w-full border lg:w-11/12 p-4 sm:p-6">
                <div className="text-xl sm:text-2xl text-gray-800 space-y-2 font-semibold">
                    <p>Hello {user.firstName }!! 🤟</p>
                    <p>Smart insights for smarter spending.</p>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mt-4">
                    <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-end gap-2">
                        <div className="flex flex-col items-start p-2 w-full sm:w-auto">
                            <label className="text-sm sm:text-base">From:</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-[#FFE4CF] rounded-lg p-2 border border-[#2D3C59] w-full sm:w-auto"
                            />
                        </div>

                        <div className="flex flex-col items-start p-2 w-full sm:w-auto">
                            <label className="text-sm sm:text-base">To:</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-[#FFE4CF] rounded-lg p-2 border border-[#2D3C59] w-full sm:w-auto"
                            />
                        </div>

                        <div className="flex flex-col items-start p-2 w-full sm:w-auto">
                            <label className="text-sm sm:text-base">Currency:</label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="bg-[#FFE4CF] rounded-lg p-2 border border-[#2D3C59] appearance-none w-full sm:w-auto"
                            >
                                {currencies.map((cur) => (
                                    <option key={cur} value={cur}>{cur}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-end w-full lg:w-auto p-2">
                        <button
                            className="bg-[#f57e3a] rounded-lg p-3 font-semibold hover:scale-90 transition-all duration-200 w-full lg:w-fit"
                            onClick={getCharts}
                        >
                            View Expenses
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-10 mt-10 w-full px-2">
                {barAmount.length > 0 && (
                    <p className="text-gray-800 font-semibold text-xl sm:text-2xl mt-4 text-center">
                        A clear view of where your money goes...
                    </p>
                )}

                <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 w-full">
                    {barAmount.length > 0 && (
                        <div className="w-full max-w-sm lg:max-w-md text-center space-y-2">
                            <div className="h-72 sm:h-80 lg:h-96 w-full">
                                <Bar data={barAmountData} key={barAmount.length} options={options} />
                            </div>
                            <p className="text-sm sm:text-base">
                                {isMoreThanMonth
                                    ? `Amount vs. Month (${currency})`
                                    : `Amount vs. Items (${currency})`}
                            </p>
                        </div>
                    )}

                    {barOther.length > 0 && (
                        <div className="w-full max-w-sm lg:max-w-md text-center space-y-2">
                            <div className="h-72 sm:h-80 lg:h-96 w-full">
                                <Bar data={barOtherData} key={barOther.length} options={options} />
                            </div>
                            <p className="text-sm sm:text-base">
                                {isMoreThanMonth
                                    ? `Amount vs. Month (${currency})`
                                    : `Amount vs. Items (${currency})`}
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 w-full">
                    {pieAmount.length > 0 && (
                        <div className="w-full max-w-sm lg:max-w-md text-center space-y-2">
                            <div className="h-72 sm:h-80 lg:h-96 w-full">
                                <Pie key={pieAmount.length} data={pieAmountData} options={options} />
                            </div>
                            <p className="text-sm sm:text-base">Amount per Items (INR)</p>
                        </div>
                    )}

                    {pieOther.length > 0 && (
                        <div className="w-full max-w-sm lg:max-w-md text-center space-y-2">
                            <div className="h-72 sm:h-80 lg:h-96 w-full">
                                <Pie key={pieOther.length} data={pieOtherData} options={options} />
                            </div>
                            <p className="text-sm sm:text-base">Amount per Item ({currency})</p>
                        </div>
                    )}
                </div>

                <div className="w-full lg:w-10/12 mt-10 overflow-x-auto">
                    {expenseTableData.length > 0 && (
                        <TravellerExpenseTable expenseTableData={expenseTableData} />
                    )}
                </div>
            </div>

            <footer className="text-xs sm:text-sm mt-4 text-center text-gray-500">
                © 2026 WorkWise. All rights reserved.
            </footer>
        </div>
    );
}

export default TravellerExpenseInsight