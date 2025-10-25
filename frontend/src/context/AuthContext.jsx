import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabase'; // Import Supabase client

export const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Supabase user object
    const [session, setSession] = useState(null); // Supabase session object
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check initial session
        supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            setLoading(false);
        });

        // Listen for auth state changes (login, logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, currentSession) => {
                setSession(currentSession);
                setUser(currentSession?.user ?? null);
                setLoading(false);
            }
        );

        // Cleanup listener on unmount
        return () => subscription?.unsubscribe();
    }, []);

    // login function might not be strictly needed if Supabase handles everything,
    // but we can keep it for triggering state updates if necessary.
    const login = (authToken, userData) => {
       // This function might become simpler or unnecessary
       // as onAuthStateChange handles updates automatically.
       // We keep it for potential manual state triggers.
       console.log("Context login called (may be redundant with Supabase listener)");
       setSession({ access_token: authToken, user: userData }); // Simulate session update
       setUser(userData);
    };

    const logout = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error logging out:", error);
        }
        // onAuthStateChange will handle setting user/session to null
        setLoading(false);
    };

    const value = {
        session,
        user,
        loading,
        login, // Keep for compatibility or specific needs
        logout,
        isAuthenticated: !!session?.access_token, // Check based on Supabase session
        token: session?.access_token // Provide token if needed elsewhere
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children} {/* Render children only when initial auth check is done */}
        </AuthContext.Provider>
    );
};

