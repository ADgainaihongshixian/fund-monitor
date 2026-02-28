import { createContext, useContext, useState, ReactNode } from 'react';
import { NavbarHeightContextType } from '@/types/common';

const NavbarHeightContext = createContext<NavbarHeightContextType | undefined>(undefined);

export const NavbarHeightProvider = ({ children }: { children: ReactNode }) => {
    const [navbarHeight, setNavbarHeight] = useState(64);

    return (
        <NavbarHeightContext.Provider value={{ navbarHeight, setNavbarHeight }}>
            {children}
        </NavbarHeightContext.Provider>
    );
};

export const useNavbarHeight = () => {
    const context = useContext(NavbarHeightContext);
    if (context === undefined) {
        throw new Error('useNavbarHeight must be used within a NavbarHeightProvider');
    }
    return context;
};
