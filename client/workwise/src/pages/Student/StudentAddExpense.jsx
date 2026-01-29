import React, { useState } from 'react'
import { FaPlus } from "react-icons/fa6";
import studentGraph from "../../assets/student-graph.jpg";
import { addExpense } from '../../api/studentExpense';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const StudentAddExpense = () => {

    const initialExpenses = ([{ itemName: "", amount: "" }])
    const [items, setItems] = useState(initialExpenses);
    const totalAmount = items.reduce(
        (sum, items) => sum + Number(items.amount || 0),
        0
    );
    const { user } = useAuth();
    const navigate = useNavigate();

    const duplicateField = () => {
        setItems([...items, { itemName: "", amount: "" }]);
    }

    const handleChange = (index, field, value) => {
        const updatedExpenses = [...items];
        updatedExpenses[index][field] = value;
        setItems(updatedExpenses);
    };

    const handleSave = async () => {

        try {

            const role = user.role.toLowerCase();
            const res = await addExpense(role, { items });

            toast.success("Expenses Added Successfully");
            setItems([{ itemName: "", amount: "" }])
        }
        catch (err) {
            console.log("STUDENT ADD EXPENSE ERROR: ", err.response?.data || err.message);
            toast.error("Fail to add items")
        }
    }


return (
  <div>
    <div className="flex flex-col lg:flex-row justify-center gap-8 p-4 lg:p-8">

      {/* Form */}
      <div className="border border-gray-700 w-full lg:w-fit p-4">
        <div className="text-gray-700 font-semibold flex flex-col sm:flex-row justify-between gap-4">
          <div className="text-2xl">
            <p className="mt-2">Hello {user.firstName}!! 🤙</p>
            <p className="mt-2">Add it now, forget it later.</p>
          </div>

          <div className="flex flex-col">
            <p>Total Amount</p>
            <input
              type="number"
              className="bg-[#EAE0CF] border border-[#213448] rounded-lg p-2 w-full sm:w-40"
              value={totalAmount}
              readOnly
            />
          </div>
        </div>

        {/* Items */}
        <div className="flex mt-3 items-center">
          <div className="flex flex-col gap-6 mt-4 w-full">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-end"
              >
                <div className="flex flex-col gap-2 w-full sm:w-auto">
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

                <div className="flex flex-col gap-2 w-full sm:w-auto">
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

                {/* Add more */}
                {index === items.length - 1 && (
                  <div className="flex items-center flex-col">
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

        {/* Save button */}
        <div className="flex justify-center sm:justify-start mt-6">
          <button
            className="p-2 rounded-lg bg-[#E37434] font-semibold w-full sm:w-1/2 hover:scale-90 transition-all duration-200"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="hidden lg:flex items-center">
        <img
          src={studentGraph}
          className="rounded-lg shadow shadow-gray-600 max-w-md"
        />
      </div>
    </div>

    <footer className="mb-10 text-sm text-gray-500 text-center">
      © 2026 WorkWise. All rights reserved.
    </footer>
  </div>
);

}

export default StudentAddExpense
