import React from 'react'
import { useState } from 'react';
import freelancerGraph from "../../assets/freelancer-graph.jpg"
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { addExpense } from '../../api/freelancerExpense';
import toast from 'react-hot-toast';

const FreelancerAddExpense = () => {

    const initialExpenses = ([{ itemName: "", amount: "", gst: "" }])
    const [items, setItems] = useState(initialExpenses);
    const totalAmount = items.reduce(
        (sum, items) => sum + Number(items.amount || 0),
        0
    );

    const { user } = useAuth();
    const navigate = useNavigate();
    const [note, setNote] = useState("");

    const duplicateField = () => {
        setItems([...items, { itemName: "", amount: "", gst: "" }]);
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
            setItems([{ itemName: "", amount: "", gst: "" }])
            setNote("")
        }
        catch (err) {
            console.log("FREELANCER ADD EXPENSE ERROR: ", err.response?.data || err.message);
            toast.error("Fail to add items")
        }
    }


    return (
<div className="w-full px-4">
  <div className="flex flex-col lg:flex-row justify-center gap-6 p-4">

    {/* LEFT CARD */}
    <div className="border border-gray-700 w-full lg:w-fit p-4 rounded-lg">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div className="text-gray-700 text-xl sm:text-2xl font-semibold">
          <p className="mt-2">Hello {user.firstName}!! 🤙</p>
          <p className="mt-2">Add it now, forget it later.</p>
        </div>

        <div className="w-full sm:w-auto">
          <p>Total Amount</p>
          <input
            type="number"
            className="bg-[#EAE0CF] border border-[#213448] rounded-lg p-2 w-full sm:w-40"
            value={totalAmount}
            readOnly
          />
        </div>
      </div>

      {/* ITEMS */}
      <div className="mt-4">
        <div className="flex flex-col gap-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row gap-4 lg:items-end"
            >
              {/* ITEM NAME */}
              <div className="flex flex-col gap-1 w-full lg:w-1/3">
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

              {/* AMOUNT + GST */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-1/2">
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
                  <label>GST(%):</label>
                  <input
                    type="number"
                    value={item.gst}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) =>
                      handleChange(index, "gst", e.target.value)
                    }
                    className="bg-[#EAE0CF] border border-[#213448] rounded-lg p-2 w-full"
                    placeholder="Enter item gst here"
                  />
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
      <div className="flex flex-col w-full sm:w-2/3 mt-4">
        <label htmlFor="note">Note:</label>
        <textarea
          id="note"
          className="bg-[#EAE0CF] p-3 rounded-lg border border-gray-950"
          placeholder="Enter note here"
          onChange={(e) => setNote(e.target.value)}
          value={note}
        />
      </div>

      {/* SAVE BUTTON */}
      <div className="flex mt-4 w-full">
        <button
          className="p-2 rounded-lg bg-[#E37434] font-semibold w-full sm:w-1/2 lg:w-1/3 hover:scale-90 transition-all duration-200"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>

    {/* RIGHT IMAGE */}
    <div className="hidden lg:flex items-center">
      <img
        src={freelancerGraph}
        className="rounded-lg shadow shadow-gray-600 max-w-md"
        alt="graph"
      />
    </div>
  </div>

  {/* FOOTER */}
  <footer className="mb-10 text-sm text-gray-500 text-center">
    © 2026 WorkWise. All rights reserved.
  </footer>
</div>

    )
}

export default FreelancerAddExpense
