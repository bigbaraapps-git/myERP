"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Company {
    id: string;
    name: string;
    oib: string;
    package: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface MultiTenantContextType {
    currentCompany: Company | null;
    currentUser: User | null;
    isLoading: boolean;
    setCompany: (company: Company) => void;
}

const MultiTenantContext = createContext<MultiTenantContextType | undefined>(undefined);

export function MultiTenantProvider({ children }: { children: React.ReactNode }) {
    const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mocking initial load
        setTimeout(() => {
            setCurrentCompany({
                id: 'cl-123',
                name: 'Primjer d.o.o.',
                oib: '12345678901',
                package: 'TRIAL'
            });
            setCurrentUser({
                id: 'u-1',
                name: 'Zoran Ruzic',
                email: 'zoran@example.com',
                role: 'ADMIN'
            });
            setIsLoading(false);
        }, 500);
    }, []);

    return (
        <MultiTenantContext.Provider value={{
            currentCompany,
            currentUser,
            isLoading,
            setCompany: (company) => setCurrentCompany(company)
        }}>
            {children}
        </MultiTenantContext.Provider>
    );
}

export const useTenant = () => {
    const context = useContext(MultiTenantContext);
    if (context === undefined) {
        throw new Error('useTenant must be used within a MultiTenantProvider');
    }
    return context;
};
