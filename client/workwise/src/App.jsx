import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/common/Home"
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import StudentAddExpense from "./pages/Student/StudentAddExpense";
import FreelancerAddExpense from './pages/Freelancer/FreelancerAddExpense';
import TravellerAddExpense from './pages/Traveller/TravellerAddExpense';
import Navbar from "./pages/common/Navbar"
import StudentExpenseInsight from './pages/Student/StudentExpenseInsight';
import FreelancerExpenseInsight from './pages/Freelancer/FreelancerExpenseInsight';
import TravellerExpenseInsight from './pages/Traveller/TravellerExpenseInsight';
import ExpenseHub from './pages/common/ExpenseHub';
import { useEffect } from 'react';
import axios from "axios"
import ProtectedRoute from './routes/ProtectedRoutes';
import PublicRoute from "./routes/PublicRoute"
import FloatingChat from './pages/Chatbot/FloatingChat';

function App() {
  return (

    <BrowserRouter>
      <Navbar />
      <FloatingChat/>
      <Routes>
        <Route path="/" element={<PublicRoute><Home/></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path='/expense-hub' element={
            <ProtectedRoute allowedRoles={["Student", "Freelancer", "Traveller"]} >
              <ExpenseHub />
            </ProtectedRoute>
        } />

        <Route
          path='/student-add-expense'
          element={
            <ProtectedRoute allowedRoles={["Student"]} >
              <StudentAddExpense />
            </ProtectedRoute>
          } />
        <Route path='/student-expense-insight' element={
          <ProtectedRoute allowedRoles={["Student"]} >
            <StudentExpenseInsight />
          </ProtectedRoute>
        } />


        <Route path='/freelancer-add-expense' element={
          <ProtectedRoute allowedRoles={["Freelancer"]} ><FreelancerAddExpense /></ProtectedRoute>
        } />
        <Route path='/freelancer-expense-insight' element={
          <ProtectedRoute allowedRoles={["Freelancer"]} ><FreelancerExpenseInsight /></ProtectedRoute>
        } />


        <Route path='/traveller-add-expense' element={
          <ProtectedRoute allowedRoles={["Traveller"]} ><TravellerAddExpense /></ProtectedRoute>
        } />
        <Route path='/traveller-expense-insight' element={
          <ProtectedRoute allowedRoles={["Traveller"]} ><TravellerExpenseInsight /></ProtectedRoute>
        } />

      </Routes>

    </BrowserRouter >
    // <div>Integration Test</div>
  )
}

export default App
