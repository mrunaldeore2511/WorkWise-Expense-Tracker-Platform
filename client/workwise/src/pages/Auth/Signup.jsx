import { AiFillEye } from "react-icons/ai";
import React, { useState } from "react";
import { signup } from "../../api/auth";
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom";
import { AiFillEyeInvisible } from "react-icons/ai";

const Signup = () => {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        role: "",
        email: "",
        password: "",
        confirmpassword: ""
    });

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmpassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const res = await signup({
                firstName: formData.firstname,
                lastName: formData.lastname,
                role: formData.role,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmpassword
            });
            toast.success("Signup successful!");
            navigate("/login");
        } catch (err) {
            console.error("Signup error:", err.response?.data || err.message);
            toast.error("Signup failed !!");
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen w-full px-4 fixed -translate-y-8'>
            <div className='bg-[#D9CFC7] w-full max-w-md flex flex-col p-4 sm:p-6 rounded-md gap-3'>
                <form 
                    className='flex flex-col rounded-md gap-3'
                    onSubmit={handleSubmit}
                >
                    <h1 className='mx-auto text-2xl sm:text-3xl font-semibold text-gray-800 text-center'>
                        Welcome to WorkWise
                    </h1>
                    <div className='flex flex-col sm:flex-row items-center justify-center gap-2 w-full text-sm'>
                        <div className='flex flex-col justify-center gap-1 w-full sm:w-[50%]'>
                            <label htmlFor="firstname">Enter Your First Name:</label>
                            <input 
                                type="text" 
                                id="firstname"
                                className='p-2 bg-[#F9F8F6] rounded-lg shadow-md shadow-gray-400'
                                placeholder='Please enter your first name here'
                                value={formData.firstname}
                                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                            />
                        </div>
                        <div className='flex flex-col justify-center gap-1 w-full sm:w-[50%]'>
                            <label htmlFor="lastname">Enter Your Last Name:</label>
                            <input 
                                type="text" 
                                id="lastname"
                                className='p-2 bg-[#F9F8F6] rounded-lg shadow-md shadow-gray-400'
                                placeholder='Please enter your last name here'
                                value={formData.lastname}
                                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className='flex flex-col justify-center gap-1 text-sm'>
                        <label htmlFor="role">Enter Your Role:</label>
                        <select 
                            name="role" 
                            id="role" 
                            className='p-2 bg-[#F9F8F6] rounded-lg shadow-md shadow-gray-400'
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="" disabled>Select an option</option>
                            <option value="Student">Student</option>
                            <option value="Freelancer">Freelancer</option>
                            <option value="Traveller">Traveller</option>
                        </select>
                    </div>
                    <div className='flex flex-col justify-center gap-1 text-sm'>
                        <label htmlFor="email">Enter Your Email:</label>
                        <input 
                            type="email" 
                            id="email"
                            className='p-2 bg-[#F9F8F6] rounded-lg shadow-md shadow-gray-400'
                            placeholder='Please enter your email here'
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className='w-full flex flex-col gap-1 text-sm'>
                        <div className='flex flex-col justify-center gap-1'>
                            <label htmlFor="password">Enter Your Password:</label>
                            <div className='flex items-center justify-center gap-1 w-full'>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    id="password"
                                    className='p-2 bg-[#F9F8F6] w-full rounded-lg shadow-md shadow-gray-400'
                                    placeholder='Please enter your password here'
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                {showPassword ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(false)}
                                    >
                                        <AiFillEyeInvisible className="text-2xl" />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(true)}
                                    >
                                        <AiFillEye className="text-2xl" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className='flex flex-col justify-center gap-1 mt-2'>
                            <label htmlFor="confirmpassword">Enter Your Confirm Password:</label>
                            <div className="flex items-center justify-center gap-1 w-full">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    id="confirmpassword"
                                    className='p-2 w-full bg-[#F9F8F6] rounded-lg shadow-md shadow-gray-400'
                                    placeholder='Please enter your confirm password here'
                                    value={formData.confirmpassword}
                                    onChange={(e) => setFormData({ ...formData, confirmpassword: e.target.value })}
                                />
                                {showConfirmPassword ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(false)}
                                    >
                                        <AiFillEyeInvisible className="text-2xl" />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(true)}
                                    >
                                        <AiFillEye className="text-2xl" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center justify-center flex-col gap-1 w-full mt-2'>
                        <button 
                            type="submit"
                            className='p-2 rounded-lg bg-[#a9c57d] w-full hover:scale-90 duration-200 transition-all hover:cursor-pointer font-semibold shadow-md shadow-gray-400'
                        >
                            Signup
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup