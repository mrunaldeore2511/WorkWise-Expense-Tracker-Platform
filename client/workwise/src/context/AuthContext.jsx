import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

// Helper function to decode JWT
const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        // Decode token to get user info
        const decoded = decodeToken(token);
        
        if (decoded) {
            // Check if token is expired
            const currentTime = Date.now() / 1000;
            if (decoded.exp && decoded.exp < currentTime) {
                // Token expired
                localStorage.removeItem("token");
                setUser(null);
                toast.error("Session expired. Please login again.");
            } else {
                // Set user from decoded token
                setUser({
                    id: decoded.id,
                    email: decoded.email,
                    name: decoded.name,
                    role: decoded.role,
                });
            }
        } else {
            localStorage.removeItem("token");
            setUser(null);
        }

        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);