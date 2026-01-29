import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const token = localStorage.getItem("token");

    // still checking auth
    if (loading) {
        return <div>Loading...</div>; // or <FullPageLoader />
    }

    // not logged in
    if (!token || !user) {
        return <Navigate to="/" replace />;
    }

    // role-based access
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
