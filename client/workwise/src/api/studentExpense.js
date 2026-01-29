import api from "./axios";

// Add expense
export const addExpense = (type, items) => api.post(`${type}/add-expense-${type}`, items);

//Get Specified expenses
export const getSpecifiedExpenses = (type, data) => api.post(`${type}/get-specified-expenses-${type}`, data);

// Get expense insights
export const getBarChart = (type, data) => api.post(`${type}/get-${type}-bar-chart`, data);
export const getPieChart = (type,data) => api.post(`${type}/get-${type}-pie-chart`,data);
