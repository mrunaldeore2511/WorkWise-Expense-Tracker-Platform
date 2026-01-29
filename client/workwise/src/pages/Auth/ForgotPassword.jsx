import React from 'react'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { forgotPassword } from '../../api/auth'

const ForgotPassword = () => {

    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            if (!email) {
                toast.error("Email is required");
                return;
            }
            const res = await forgotPassword({ email: email });
            toast.success(`Reset link sent to ${email}`);
        }
        catch (err) {
            console.error("Forgot Password error:", err.response?.data || err.message);
            // toast.error("Forg failed !!");
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen w-full px-4 fixed -translate-y-8'>
            <div className='bg-[#D9CFC7] w-full max-w-md flex flex-col p-6 sm:p-8 rounded-md gap-5'>
                <h1 className='text-2xl sm:text-3xl text-gray-800 text-center font-semibold'>
                    Forgot Password
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className='space-y-6'
                >
                    <div className='flex flex-col justify-center gap-2'>
                        <label htmlFor="email">Enter Your Email:</label>
                        <input 
                            type="email" 
                            id="email"
                            className='p-2 bg-[#F9F8F6] rounded-lg shadow-md shadow-gray-400'
                            placeholder='Please enter your email here'
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>
                    <button 
                        type="submit"
                        className='p-3 rounded-lg bg-[#a9c57d] w-full hover:scale-90 duration-200 transition-all hover:cursor-pointer font-semibold shadow-md shadow-gray-400'
                    >
                        Send Email
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword