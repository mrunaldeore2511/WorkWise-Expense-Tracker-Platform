import React from 'react'
import homehero1 from '../../assets/herohome1.png';
import { PiStudentFill } from "react-icons/pi";
import { SiFreelancer } from "react-icons/si";
import { GoRocket } from "react-icons/go";
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("token");

    return (
        <div className='w-full min-h-screen pb-8 flex items-center justify-center flex-col'>
            <h1 className="text-center mx-auto text-4xl sm:text-5xl md:text-6xl pt-6 font-semibold tracking-wide text-gray-900 drop-shadow-sm px-4">
                WorkWise
            </h1>

            <p className="text-center text-sm sm:text-base pt-2 text-gray-900 font-medium tracking-wide italic opacity-90 px-4">
                Money Simplified...
            </p>

            <div className='rounded-2xl w-full px-4'>
                <img 
                    src={homehero1} 
                    alt="WorkWise Hero" 
                    className='rounded-4xl mx-auto w-full sm:w-[70%] md:w-[50%] pt-2' 
                />
            </div>

            <div className="mx-auto max-w-3xl text-center pt-8 px-4">
                <p className="text-base sm:text-lg font-semibold tracking-wide text-gray-800">
                    Track. Understand. Control.
                </p>

                <p className="mt-4 leading-relaxed text-sm sm:text-base md:text-lg">
                    WorkWise gives you a clear view of where your money goes, helping you
                    make smarter decisions every day. From daily spending to long-term trends,
                    everything is organized in one place. Because money should be simple.
                </p>
            </div>

            <div className='font-semibold w-full sm:w-[80%] mx-auto flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 pt-8 px-4'>
                {!isLoggedIn ? (
                    <>
                        <button 
                            className='bg-[#9CAFAA] p-3 rounded-lg hover:bg-[#80918c] transition-all duration-200 shadow-md shadow-gray-400 hover:shadow-lg hover:scale-90'
                            onClick={() => navigate("/signup")}
                        >
                            Sign Up Now
                        </button>

                        <button 
                            className='bg-[#dfb278] p-3 rounded-lg hover:bg-[#c29c6a] transition-all duration-200 shadow-md shadow-gray-400 hover:shadow-lg hover:scale-90'
                            onClick={() => navigate("/login")}
                        >
                            Login Now
                        </button>
                    </>
                ) : (
                    <button 
                        className='bg-[#dfb278] p-3 rounded-lg hover:bg-[#c29c6a] transition-all duration-200 shadow-md shadow-gray-400 hover:shadow-lg hover:scale-90'
                        onClick={() => navigate("/expense-hub")}
                    >
                        Go to Expense Hub
                    </button>
                )}
            </div>

            <div className="mx-auto max-w-5xl pt-16 px-4">
                <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-10">
                    Who can use WorkWise?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col text-center items-center justify-center p-6 bg-[#cdebf7] rounded-lg hover:scale-110 transition-all duration-200">
                        <div className="text-4xl mb-4 mx-auto">
                            <PiStudentFill />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Student</h3>
                        <p className="text-gray-600">
                            Enter item names and amounts. Visualize spending patterns with charts. Manage your budget effortlessly.
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center p-6 bg-[#cdebf7] rounded-lg hover:scale-110 transition-all duration-200">
                        <div className="text-4xl mb-4 mx-auto">
                            <SiFreelancer />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Freelancer</h3>
                        <p className="text-gray-600">
                            Track items, amounts, and GST details. View comprehensive expense charts. Stay organized with tax-ready records.
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center p-6 bg-[#cdebf7] rounded-lg hover:scale-110 transition-all duration-200">
                        <div className="text-4xl mb-4">
                            <GoRocket />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Traveller</h3>
                        <p className="text-gray-600">
                            Record items, amounts, and currencies. Get live exchange rate updates. Track multi-country expenses with visual insights.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-2xl pt-16 px-4 text-center">
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
                    Ready to Take Control?
                </h2>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                    Join the users who've simplified their finances with WorkWise
                </p>
                <button 
                    className='bg-[#896C6C] px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-white font-semibold hover:bg-[#9F8383] transition-all duration-200 hover:scale-90'
                    onClick={() => navigate("/signup")}
                >
                    {isLoggedIn ? "Get Started" : "Get Started for Free"}
                </button>
            </div>

            <footer className="mt-10 text-xs sm:text-sm text-gray-500 px-4 text-center">
                © 2026 WorkWise. All rights reserved.
            </footer>
        </div>
    )
}

export default Home