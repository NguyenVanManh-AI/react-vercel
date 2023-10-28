import React, { createContext, useContext, useState } from 'react';
const AdminContext = createContext();

export function AdminProvider({ children }) {
    return (
        <AdminContext.Provider value={{  }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdminContext() {
    return useContext(AdminContext);
}
