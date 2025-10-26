import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
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
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ------------------------------
    // INITIAL SESSION CHECK
    // ------------------------------
    useEffect(() => {
        // Check for existing session
        const initializeSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                
                if (session?.access_token) {
                    setToken(session.access_token);
                    
                    // Fetch user profile from backend
                    const response = await axios.get('http://localhost:3001/api/auth/me', {
                        headers: { 'Authorization': `Bearer ${session.access_token}` }
                    });
                    
                    setUser(response.data);
                    console.log('✅ Session restored:', response.data);
                }
            } catch (error) {
                console.error('Session initialization failed:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.access_token) {
                setToken(session.access_token);
                
                try {
                    const response = await axios.get('http://localhost:3001/api/auth/me', {
                        headers: { 'Authorization': `Bearer ${session.access_token}` }
                    });
                    setUser(response.data);
                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                }
            } else if (event === 'SIGNED_OUT') {
                setToken(null);
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        try {
            // Authenticate with Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            if (!data.session?.access_token) {
                throw new Error('No access token received');
            }

            setToken(data.session.access_token);

            // Fetch user profile from backend
            const response = await axios.get('http://localhost:3001/api/auth/me', {
                headers: { 'Authorization': `Bearer ${data.session.access_token}` }
            });

            setUser(response.data);
            console.log('✅ Login successful:', response.data);

            return response.data;

        } catch (error) {
            console.error('Login failed:', error);
            throw new Error(error.message || 'Login failed. Please check your credentials.');
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
        
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Logout error:', error);
        }
        
        setToken(null);
        setUser(null);
        setSession(null);
        setLoading(false);
        
        console.log('✅ Logged out successfully');
    };

    const value = {
        user,                 // Full profile
        session,              // Supabase session
        token: session?.access_token || null,
        isAuthenticated: !!session?.access_token,
        loading,
        login,
        logout,
        isAuthenticated: !!token
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
