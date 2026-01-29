import React from 'react'
import logo from '../../assets/logo.jpg';
import logoText from '../../assets/logoText.png';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FiLogIn } from "react-icons/fi";
import { VscSignIn } from "react-icons/vsc";

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("token");
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    }

    const location = useLocation();
    const isExpenseHub = location.pathname === "/expense-hub";

    return (
        <div className='bg-[#f8f8f8] flex justify-between items-center mx-auto px-4 sm:px-8 py-2 sm:py-0 shadow-sm shadow-gray-400'>
            <div className='flex items-center gap-2 p-2 justify-center'>
                <img 
                    src={logo} 
                    alt="WorkWise Logo" 
                    className='w-10 sm:w-12 rounded-xl' 
                />
                <img 
                    src={logoText} 
                    alt="WorkWise" 
                    className='w-32 sm:w-40 hidden sm:block' 
                />
            </div>

            <div className='flex justify-center gap-3 sm:gap-6 p-3'>
                {isLoggedIn ? (
                    <>
                        {!isExpenseHub && (
                            <button 
                                className='bg-[#8cbcbe] p-2 sm:p-3 rounded-lg hover:bg-[#6a9496] transition-all duration-200 hover:scale-90 text-sm sm:text-base flex items-center gap-2'
                                onClick={() => navigate("/expense-hub")}
                            >
                                <span className='hidden sm:inline'>Expense Hub</span>
                                <span className='sm:hidden'>Hub</span>
                            </button>
                        )}

                        <button 
                            className='bg-[#f88181] p-2 sm:p-3 rounded-lg hover:bg-[#fc5353] transition-all duration-200 hover:scale-90 text-sm sm:text-base'
                            onClick={() => handleLogout()}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            className='bg-[#D6A99D] p-2 sm:p-3 rounded-lg hover:bg-[#ac877d] transition-all duration-200 hover:scale-90 text-sm sm:text-base flex items-center gap-2'
                            onClick={() => navigate("/signup")}
                        >
                            <VscSignIn className='text-lg sm:text-xl' />
                            <span className='hidden sm:inline'>Sign Up</span>
                        </button>

                        <button 
                            className='bg-[#89aa82] p-2 sm:p-3 rounded-lg hover:bg-[#6c8867] transition-all duration-200 hover:scale-90 text-sm sm:text-base flex items-center gap-2'
                            onClick={() => navigate("/login")}
                        >
                            <FiLogIn className='text-lg sm:text-xl' />
                            <span className='hidden sm:inline'>Login</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default Navbar