# WorkWise

## Project Description

WorkWise is a full-stack expense management and productivity platform designed to help users track expenses, gain insights, and manage financial data efficiently. The application provides a clean dashboard, expense categorization, and visual analytics using charts.

It follows a modern **client–server architecture** with secure authentication, public and protected routing, and includes an integrated **Gemini-powered chatbot** to assist users with navigation, feature understanding, and overall usage support.

---

## Table of Contents

- Features
- Tech Stack
- Project Structure
- Screenshots
- Installation & Setup
- Running the Project
- How to Use the Application
- Routing Strategy
- Future Improvements

---

## Features

- User authentication (Signup / Login)
- Protected expense hub for authenticated users
- Add, view, and manage expenses
- Expense insights with bar and pie charts
- Monthly and daily category-based analysis
- User-specific workflows (Student, Freelancer, Traveller)
- Integrated Gemini chatbot for in-app assistance
- Clean UI with reusable components
- Secure API with token-based authentication

---

## Tech Stack

### Frontend

- React
- React Router
- Chart.js
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication

---

## Project Structure

workwise/
│
├── client/
│ └── workwise/
│ ├── src/
| | ├── assests/
│ │ ├── pages/
│ │ ├── context/
│ │ ├── routes/
│ │ ├── api/
│ │ └── App.jsx
│ └── package.json
│
├── server/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── config/
│ └── server.js

---

## Screenshots

Below are some screenshots showcasing the WorkWise user interface and core features.

### Landing Page

![Home Page](screenshots/home1.jpeg)
(screenshots/home2.jpeg)
(screenshots/home3.jpeg)

### Signup Page

![Signup Page](screenshots/signup.jpeg)

### Login Page

![Login Page](screenshots/login.jpeg)

### Expense Hub

![Expense Hub](screenshots/expense hub.jpeg)

### Add Expense (Student)

![Add Expense](screenshots/student-add-expense.jpeg)
![Expense-Insight](screenshots/student-expense-insight1.jpeg)
(screenshots/student-expense-insight2.jpeg)
(screenshots/student-expense-insight3.jpeg)

### Add Expense (Freelancer)

![Add Expense](screenshots/freelancer-add-expense.jpeg)
![Expense-Insight](screenshots/freelancer-expense-insight1.jpeg)
(screenshots/freelancer-expense-insight2.jpeg)
(screenshots/freelancer-expense-insight3.jpeg)

### Add Expense (Traveller)

![Add Expense](screenshots/traveller-add-expense.jpeg)
![Expense-Insight](screenshots/traveller-expense-insight1.jpeg)
(screenshots/traveller-expense-insight2.jpeg)
(screenshots/traveller-expense-insight3.jpeg)

---

## Installation & Setup

### Prerequisites

- Node.js installed
- MongoDB installed or MongoDB Atlas account
- Git

---

## Running the Project

### Backend Setup

cd server
npm install

Create a `.env` file in the `server` folder:

PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
MAIL_HOST=
MAIL_USER=
MAIL_PORT=
MAIL_PASSWORD=

Start the backend server:

### Frontend Setup

cd client/workwise
npm install
npm run dev

The application will run on:

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

---

## How to Use the Application

1. Open the application in your browser
2. Signup using a new account or login with existing credentials
3. After login, you will be redirected to the expense hub page
4. Add new expenses using the Add Expense page
5. Analyze expenses using charts and monthly filters

---

## Routing Strategy

### Public Routes

- `/` – Landing page
- `/login` – User login
- `/signup` – User registration

### Protected Routes

- `/expense-hub` – Expense analytics
- `/add-expense` – Add new expense

Unauthorized users cannot access protected routes.

---

## Future Improvements

- Edit and delete expenses
- Export expense reports
- Dark mode
- Role-based access control

---

## Author

Mrunal Deore

---

## License

This project is for educational and personal use.
