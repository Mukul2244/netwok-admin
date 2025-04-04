"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface UserDetails {
    id: string;
    username: string;
    email: string;
}
const defaultUser: UserDetails = {
    id: "",
    username: "",
    email: "",
};
const UserContext = createContext<{
    userDetails: UserDetails;
    setUserDetails: (userDetails: UserDetails) => void;
}>({
    userDetails : defaultUser,
    setUserDetails: () => { },
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [userDetails, setUserDetails] = useState<UserDetails>(defaultUser);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUserDetails(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(userDetails));
    }, [userDetails]);

    return (
        <UserContext.Provider value={{ userDetails ,setUserDetails }}>
            {children}
        </UserContext.Provider>
    );
};
