import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    useEffect(() => {

        const savedUser = JSON.parse(localStorage.getItem("currentUser"));

        if (savedUser) {
            setUser(savedUser);
        }

    }, []);

    const login = (userData) => {

        setUser(userData);

        localStorage.setItem(
            "currentUser",
            JSON.stringify(userData)
        );

    };

    const logout = () => {

        setUser(null);

        localStorage.removeItem("currentUser");

    };

    return (

        <AuthContext.Provider
            value={{ user, login, logout }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {
    return useContext(AuthContext);
}