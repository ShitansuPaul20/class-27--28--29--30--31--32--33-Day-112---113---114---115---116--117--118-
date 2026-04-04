import { createContext } from "react";

export const userContext = createContext();

import {useState} from 'react';


export const UserContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    

    return (
        <userContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
            {children}
        </userContext.Provider>
    );
};

