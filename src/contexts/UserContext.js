import React, { createContext, useContext, useState } from 'react';
const UserContext = createContext();

export function UserProvider({ children }) {
    return (
        <UserContext.Provider value={{  }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
    return useContext(UserContext);
}
