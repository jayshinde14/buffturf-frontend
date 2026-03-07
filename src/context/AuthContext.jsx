import React, { createContext, useState, useContext } from 'react';

// Create context
const AuthContext = createContext();

// Provider wraps whole app and shares login state
export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {
        // Load user from localStorage if already logged in
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Call this after successful login
    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    // Call this to logout
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth anywhere
export function useAuth() {
    return useContext(AuthContext);
}