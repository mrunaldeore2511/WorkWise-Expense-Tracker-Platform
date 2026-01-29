import React from 'react'
import LoginImage from "../../assets/loginImg.jpg"
import { login } from "../../api/auth";
import toast from "react-hot-toast";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";

const Login = () => {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { setUser } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await login({
                email: formData.email,
                password: formData.password,
            });
            toast.success("Login successful!");
            setUser(res.data.existingUser);
            localStorage.setItem("token", res.data.token);
            navigate("/expense-hub")
        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            toast.error("Login failed !!");
        }
    };


    return (
        <div className='absolute top-1/4 left-1/3'>
            <div className='bg-[#D9CFC7] w-[90%]  max-w-md flex flex-col p-4 rounded-md gap-5'>
                <form className='flex flex-col gap-5 p-4 rounded-md '
                    onSubmit={handleSubmit}
                >
                    <h1 className='mx-auto text-3xl font-semibold text-gray-800 text-center'>
                        Welcome back to WorkWise
                    </h1>
                    <div className='flex flex-col justify-center gap-2'>
                        <label htmlFor="email">Enter Your Email:</label>
                        <input type="email" id="email"
                            className='p-2 bg-[#F9F8F6] rounded-lg shadow-md shadow-gray-400'
                            placeholder='Please enter your email here'
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className='flex flex-col justify-center gap-2'>
                        <label htmlFor="password">Enter Your Password:</label>
                        <div className="flex items-center gap-1 w-full">
                            <input type={ showPassword? "text" : "password"} id="password"
                            className='p-2 bg-[#F9F8F6] w-full rounded-lg shadow-md shadow-gray-400'
                            placeholder='Please enter your password here'
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                                { 
                                    showPassword ?
                                        (<>
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(false)}
                                            >
                                                <AiFillEyeInvisible className="text-2xl" />
                                            </button>
                                        </>) :
                                        
                                        (<>
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(true)}
                                            >
                                                <AiFillEye className="text-2xl"/>
                                            </button>
                                        </>)
                                }
                        </div>
                    </div>
                    <div className='flex items-center justify-center flex-col gap-3 w-full'>
                        <button type="submit"
                            className='p-3 rounded-lg bg-[#a9c57d] w-full hover:scale-90 duration-200 transition-all hover:cursor-pointer font-semibold shadow-md shadow-gray-400 '
                        >Login</button>
                    </div>
                </form>
                <button className='text-sm text-slate-950 underline hover:cursor-pointer -mt-2'
                    onClick={() => navigate("/forgot-password")}
                >
                    Forgot Password
                </button>
            </div >

        </div >
    )
}

export default Login
