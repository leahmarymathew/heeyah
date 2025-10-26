import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../supabase'; // Supabase client

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

// AuthProvider
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);          // Full user profile (with role, etc.)
    const [session, setSession] = useState(null);    // Supabase session
    const [loading, setLoading] = useState(true);    // Loading state

    // ------------------------------
    // INITIAL SESSION CHECK
    // ------------------------------
    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true);
            const { data: { session: currentSession }, error } = await supabase.auth.getSession();

            if (error) {
                console.error("Error getting session:", error);
                setLoading(false);
                return;
            }

            if (currentSession) {
                setSession(currentSession);
                await fetchUserProfile(currentSession.access_token);
            } else {
                setSession(null);
                setUser(null);
            }
            setLoading(false);
        };

        initializeAuth();

        // ------------------------------
        // LISTEN TO AUTH CHANGES
        // ------------------------------
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
                console.log("Auth event:", event);
                setSession(newSession);
                if (newSession?.access_token) {
                    await fetchUserProfile(newSession.access_token);
                } else {
                    setUser(null);
                }
            }
        );

        return () => subscription?.unsubscribe();
    }, []);

    // ------------------------------
    // FETCH USER PROFILE FROM BACKEND
    // ------------------------------
    const fetchUserProfile = async (token) => {
        try {
            const response = await axios.get('http://localhost:3001/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data) {
                setUser(response.data);
            } else {
                console.error("Profile not found for this user");
                setUser(null);
            }
        } catch (err) {
            console.error("Failed to fetch user profile:", err.response?.data || err.message);
            setUser(null);
        }
    };

    // ------------------------------
    // LOGIN FUNCTION
    // ------------------------------
    const login = async (email, password) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setLoading(false);
            console.error("Login failed:", error.message);
            throw new Error(error.message || "Login failed");
        }

        const token = data.session?.access_token;
        if (token) {
            await fetchUserProfile(token);
            setSession(data.session);
        }
        setLoading(false);
    };

    // ------------------------------
    // LOGOUT FUNCTION
    // ------------------------------
    const logout = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error logging out:", error);
        }
        setUser(null);
        setSession(null);
        setLoading(false);
    };

    // ------------------------------
    // CONTEXT VALUE
    // ------------------------------
    const value = {
        user,                 // Full profile
        session,              // Supabase session
        token: session?.access_token || null,
        isAuthenticated: !!session?.access_token,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
