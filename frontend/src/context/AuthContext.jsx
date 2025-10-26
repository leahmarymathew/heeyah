import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create AuthContext
export const AuthContext = createContext(null);

// Custom hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for saved session on app start
    useEffect(() => {
        const savedUser = localStorage.getItem('simpleUser');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Error parsing saved user:', error);
                localStorage.removeItem('simpleUser');
            }
        }
        setLoading(false);
    }, []);

    // Simple login - just check if user exists in database
    const login = async (email, password) => {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        try {
            setLoading(true);
            
            // Call simple login endpoint
            const response = await axios.post('http://localhost:3001/api/auth/simple-login', {
                email: email,
                password: password
            });

            if (response.data.success) {
                const userData = response.data.user;
                setUser(userData);
                
                // Save to localStorage for persistence
                localStorage.setItem('simpleUser', JSON.stringify(userData));
                

                return userData;
            } else {
                throw new Error(response.data.message || 'Login failed');
            }

        } catch (error) {
            console.error('Login failed:', error);
            throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    // Simple logout
    const logout = async () => {
        setUser(null);
        localStorage.removeItem('simpleUser');

    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
