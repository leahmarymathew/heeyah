import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase'; // Import the Supabase client
import axios from 'axios'; // Import axios for API calls

// Create the context
export const AuthContext = createContext(null);

// Custom hook to use the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// This is a continuation of the AuthProvider
// (This code block is not a complete file)

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null); // This will hold the full profile
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // This effect runs once when the app loads
        const initializeSession = async () => {
            // 1. Check if a session already exists with Supabase
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (session) {
                const authToken = session.access_token;
                setToken(authToken);

                try {
                    // 2. If session exists, fetch the full user profile from our backend
                    const response = await axios.get('http://localhost:3001/api/auth/me', {
                        headers: { Authorization: `Bearer ${authToken}` }
                    });
                    
                    if (response.data) {
                        setUser(response.data); // Set the full profile (with role, roll_no, etc.)
                    } else {
                        // User is in Supabase Auth but not in our profile tables
                        throw new Error('User profile not found.');
                    }
                } catch (err) {
                    console.error("Failed to fetch user profile:", err);
                    // If profile fetch fails, log them out
                    await supabase.auth.signOut();
                    setUser(null);
                    setToken(null);
                }
            } else {
                // No session
                setUser(null);
                setToken(null);
            }
            setLoading(false);
        };

        initializeSession();

        // 3. Listen for future auth state changes (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
                setLoading(true);
                const authToken = newSession?.access_token || null;
                setToken(authToken);

                if (event === 'SIGNED_IN' && authToken) {
                    try {
                        // When a new login is detected, fetch the full profile
                        const response = await axios.get('http://localhost:3001/api/auth/me', {
                            headers: { Authorization: `Bearer ${authToken}` }
                        });
                        setUser(response.data);
                    } catch (err) {
                        console.error("Failed to fetch user profile after SIGNED_IN:", err);
                        setUser(null);
                    }
                } else if (event === 'SIGNED_OUT') {
                    setUser(null);
                }
                setLoading(false);
            }
        );

        // Cleanup listener on unmount
        return () => subscription?.unsubscribe();
    }, []);

    // ... (login and logout functions to follow) ...
        // ... (state and useEffect from Part 2) ...

    // The login function is now simpler. It just triggers the Supabase login.
    // The onAuthStateChange listener above will handle fetching the profile.
    const login = async (email, password) => {
        // This function is now just a wrapper for the Supabase call
        // The Login.jsx component will call this
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw error; // Let the Login.jsx component catch and display this error
        }

        // If login is successful, the 'onAuthStateChange' listener will automatically
        // fetch the user's profile and update the state.
        return data;
    };

    const logout = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error logging out:", error);
        }
        // The 'onAuthStateChange' listener will handle setting user/token to null.
        setToken(null);
        setUser(null);
        setLoading(false);
    };

    // This is the value that all components in your app can access
    const value = {
        token,
        user,
        loading,
        login, // Expose the new login function
        logout,
        isAuthenticated: !!token // True if a token exists
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children} {/* Render children only when auth check is complete */}
        </AuthContext.Provider>
    );
};
