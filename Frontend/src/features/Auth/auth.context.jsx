import { useState, useEffect } from "react";
import { AuthContext } from "./authContext";
import { fetchUserData } from "../User/services/user.api"; // path check karna

export const AuthProvider = ({ children }) => {
    const [User, setUser] = useState(null);
    const [loading, setloading] = useState(true);

    useEffect(() => {
        const initUser = async () => {
            try {
                const data = await fetchUserData();
                setUser(data.user);
            } catch (error) {
                setUser(null); 
            } finally {
                setloading(false);
            }
        };
        initUser();
    }, []);

    return (
        <AuthContext.Provider value={{ User, setUser, loading, setloading }}>
            {children}
        </AuthContext.Provider>
    );
}


