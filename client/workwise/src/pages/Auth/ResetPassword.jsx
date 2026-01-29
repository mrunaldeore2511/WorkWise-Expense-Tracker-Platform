import React from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { resetPassword } from '../../api/auth'
import { useParams, useNavigate } from 'react-router-dom'

const ResetPassword = () => {
    const [resetPasswords, setResetPasswords] = useState({ password: "", confirmPassword: "" });
    const navigate = useNavigate();
    const { token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await resetPassword(token, {
                password: resetPasswords.password,
                confirmPassword: resetPasswords.confirmPassword
            })
            toast.success("Password Reset Successfully!");
            navigate("/login");
        }
        catch (err) {
            console.error("Password Reset error:", err.response?.data || err.message);
            toast.error("Password Reset failed !!");
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen w-full px-4 fixed -translate-y-8'>
            <div className='bg-[#D9CFC7] w-full max-w-md flex flex-col p-6 sm:p-8 rounded-md gap-5'>
                <h1 className='text-2xl sm:text-3xl text-gray-800 text-center font-semibold'>
                    Reset Password
                </h1>
                <form 
                    className='space-y-4'
                    onSubmit={handleSubmit}
                >
                    <div className='flex flex-col justify-center gap-2'>
                        <label htmlFor="password">Enter Your Password:</label>
                        <input 
                            type="password" 
                            id="password"
                            className='p-2 bg-[#F9F8F6] rounded-lg shadow-md shadow-gray-400'
                            placeholder='Please enter your password here'
                            value={resetPasswords.password}
                            onChange={(e) => setResetPasswords({ ...resetPasswords, password: e.target.value })}
                        />
                    </div>
                    <div className='flex flex-col justify-center gap-2'>
                        <label htmlFor="confirmpassword">Enter Your Confirm Password:</label>
                        <input 
                            type="password" 
                            id="confirmpassword"
                            className='p-2 bg-[#F9F8F6] rounded-lg shadow-md shadow-gray-400'
                            placeholder='Please enter your confirm password here'
                            value={resetPasswords.confirmPassword}
                            onChange={(e) => setResetPasswords({ ...resetPasswords, confirmPassword: e.target.value })}
                        />
                    </div>
                    <button 
                        type="submit"
                        className='p-3 rounded-lg bg-[#a9c57d] w-full hover:scale-90 duration-200 transition-all hover:cursor-pointer font-semibold shadow-md shadow-gray-400'
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword