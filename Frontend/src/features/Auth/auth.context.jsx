import { useState } from "react";
import { AuthContext } from "./authContext";


export const AuthProvider = ({ children }) => {

    const [User, setUser] = useState(null);
    const [loading, setloading] = useState(true);
  
    

    return (
        <AuthContext.Provider value={{User , setUser , loading , setloading}}>
            {children}
        </AuthContext.Provider>
    );
}


