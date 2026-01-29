import React from 'react'
import { FaPlus } from "react-icons/fa6";
import travellerGraph from "../../assets/traveller-graph.jpg"
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { addExpense } from '../../api/travellerExpense';
import { useAuth } from '../../context/AuthContext';

const TravellerAddExpense = () => {

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

    const initialExpenses = ([{ itemName: "", amount: "", currency: "INR" }])
    const [items, setItems] = useState(initialExpenses);
    const totalAmount = items.reduce(
        (sum, items) => sum + Number(items.amount || 0),
        0
    );

    const { user } = useAuth();
    const navigate = useNavigate();
    const [note, setNote] = useState("");

    const duplicateField = () => {
        setItems([...items, { itemName: "", amount: "", currency: "INR" }]);
    }

    const handleChange = (index, field, value) => {
        const updatedExpenses = [...items];
        updatedExpenses[index][field] = value;
        setItems(updatedExpenses);
    };

    const handleSave = async () => {

        try {

            const role = user.role.toLowerCase();
            const res = await addExpense(role, { items, note });

            toast.success("Expenses Added Successfully");
            setItems([{ itemName: "", amount: "", currency: "INR" }])
            setNote("")
        }
        catch (err) {
            console.log("TRAVELLER ADD EXPENSE ERROR: ", err.response?.data || err.message);
            toast.error("Fail to add items")
        }
    }


return (
  <div>
    <div className="flex flex-col lg:flex-row justify-center gap-5 p-4">
      
      {/* FORM CARD */}
      <div className="border border-gray-700 w-full lg:w-fit p-4">
        <div className="flex justify-between items-center">
          <div className="text-gray-700 text-2xl font-semibold">
            <p className="mt-2">Hello {user.firstName}!!🤙</p>
            <p className="mt-2">Add it now, forget it later.</p>
          </div>
        </div>

        <div className="flex mt-3 items-center">
          <div className="flex flex-col gap-3 mt-4 w-full">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full"
              >
                {/* ITEM NAME */}
                <div className="flex flex-col gap-1 w-full lg:w-auto">
                  <label>Item Name:</label>
                  <input
                    type="text"
                    value={item.itemName}
                    onChange={(e) =>
                      handleChange(index, "itemName", e.target.value)
                    }
                    className="bg-[#EAE0CF] border border-[#213448] rounded-lg p-2 w-full"
                    placeholder="Enter item name here"
                  />
                </div>

                {/* AMOUNT + CURRENCY */}
                <div className="flex flex-col sm:flex-row items-center gap-5 w-full lg:w-1/2">
                  <div className="flex flex-col gap-1 w-full sm:w-1/2">
                    <label>Amount:</label>
                    <input
                      type="number"
                      value={item.amount}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) =>
                        handleChange(index, "amount", e.target.value)
                      }
                      className="bg-[#EAE0CF] border border-[#213448] rounded-lg p-2 w-full"
                      placeholder="Enter item amount here"
                    />
                  </div>

                  <div className="flex flex-col gap-1 w-full sm:w-1/2">
                    <label>Currency:</label>
                    <select
                      value={item.currency}
                      onChange={(e) =>
                        handleChange(index, "currency", e.target.value)
                      }
                      className="bg-[#EAE0CF] border border-[#213448] rounded-lg py-2 pl-2 appearance-none w-full"
                    >
                      {currencies.map((cur) => (
                        <option key={cur} value={cur}>
                          {cur}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ADD MORE */}
                {index === items.length - 1 && (
                  <div className="flex flex-col items-center w-fit">
                    <p>Add More</p>
                    <button
                      onClick={duplicateField}
                      className="px-3 py-1 bg-[#628141] rounded-xl text-gray-950 w-12 h-12 flex justify-center items-center hover:scale-90 transition"
                    >
                      <FaPlus />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* NOTE */}
        <div className="flex flex-col w-full lg:w-1/2 mt-4">
          <label htmlFor="note">Note:</label>
          <textarea
            id="note"
            className="bg-[#EAE0CF] p-3 rounded-lg border border-gray-950 w-full"
            placeholder="Enter note here"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* SAVE BUTTON */}
        <div className="flex items-start justify-start mt-4 w-full">
          <button
            className="p-2 rounded-lg bg-[#E37434] font-semibold w-full sm:w-1/3 hover:scale-90 transition-all duration-200"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>

      {/* IMAGE (hidden on mobile) */}
      <div className="hidden lg:flex items-center">
        <img
          src={travellerGraph}
          className="rounded-lg shadow shadow-gray-600 max-w-md"
          alt="Traveller graph"
        />
      </div>
    </div>

    <footer className="text-sm text-center text-gray-500 mb-6">
      © 2026 WorkWise. All rights reserved.
    </footer>
  </div>
);

}

export default TravellerAddExpense
