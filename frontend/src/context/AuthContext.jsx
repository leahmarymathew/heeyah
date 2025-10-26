import React, { createContext, useContext, useState, useEffect } from 'react';

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
        // Check for existing session in localStorage
        const initializeSession = () => {
            const savedUser = localStorage.getItem('mockUser');
            const savedToken = localStorage.getItem('mockToken');
            
            if (savedUser && savedToken) {
                setUser(JSON.parse(savedUser));
                setToken(savedToken);
                console.log('✅ Session restored from localStorage');
            }
            setLoading(false);
        };

        initializeSession();
    }, []);

    // ... (login and logout functions to follow) ...
        // ... (state and useEffect from Part 2) ...

    // Simple mock login function for development
    const login = async (email, password) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock validation - accept any password for development
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        console.log('✅ Mock login successful');
        console.log('Email:', email);

        // Determine role based on email pattern
        let role = 'student'; // default
        if (email.includes('warden')) {
            role = 'warden';
        } else if (email.includes('admin')) {
            role = 'admin';
        } else if (email.includes('caretaker')) {
            role = 'caretaker';
        }

        // Create user profile from email
        const userProfile = {
            user_id: 'mock-' + Date.now(),
            email: email,
            name: email.split('@')[0],
            role: role,
            roll_no: role === 'student' ? 'STU001' : null
        };

        console.log('✅ Created user profile:', userProfile);

        // Save to localStorage for persistence
        localStorage.setItem('mockUser', JSON.stringify(userProfile));
        localStorage.setItem('mockToken', 'mock-token-' + Date.now());

        setUser(userProfile);
        setToken('mock-token-' + Date.now());

        return userProfile;
    };

    const logout = async () => {
        setLoading(true);
        
        // Clear localStorage
        localStorage.removeItem('mockUser');
        localStorage.removeItem('mockToken');
        
        // Clear state
        setToken(null);
        setUser(null);
        setLoading(false);
        
        console.log('✅ Logged out successfully');
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
