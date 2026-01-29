import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const ExpenseHub = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAddExpense = () => {
        const token = localStorage.getItem("token");
        const role = user.role;

        if (role == "Student") {
            navigate('/student-add-expense');
        }
        else if (role == "Freelancer") {
            navigate('/freelancer-add-expense');
        }
        else if (role == "Traveller") {
            navigate('/traveller-add-expense');
        }
    }

    const handleExpenseInsight = () => {
        const token = localStorage.getItem("token");
        const role = user.role;

        if (role == "Student") {
            navigate('/student-expense-insight');
        }
        else if (role == "Freelancer") {
            navigate('/freelancer-expense-insight');
        }
        else if (role == "Traveller") {
            navigate('/traveller-expense-insight');
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen w-full px-4 fixed -translate-y-8'>
            <div className='bg-[#f7ede6] w-full max-w-md flex flex-col p-8 sm:p-14 rounded-md gap-8'>
                <h1 className='text-2xl sm:text-3xl text-gray-800 text-center font-semibold'>
                    From numbers to clarity...
                </h1>
                <div className='flex flex-col justify-center gap-2'>
                    <button
                        className='p-3 bg-[#ffcb53] rounded-lg hover:scale-90 transition-all duration-200 font-semibold'
                        onClick={() => handleAddExpense()}
                    >
                        Add Expense
                    </button>
                </div>
                <div className='flex flex-col justify-center gap-2'>
                    <button
                        onClick={() => handleExpenseInsight()}
                        className='p-3 bg-[#ffcb53] rounded-lg hover:scale-90 transition-all duration-200 font-semibold'
                    >
                        Expense Insight
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ExpenseHub