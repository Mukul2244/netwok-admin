"use client";
import React, {
    createContext,
    useContext,
    // useEffect,
    useState,
} from "react";
// import fetchUser from "@/lib/fetchUser";
// import getCookie from "@/lib/getCookie";

const AuthContext = createContext<{
    _id: string;
    setId: (id: string) => void;
    email: string;
    setEmail: (email: string) => void;
    username: string;
    setUsername: (username: string) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}>({
    _id: "",
    setId: () => { },
    email: "",
    setEmail: () => { },
    username: "",
    setUsername: () => { },
    isLoggedIn: false,
    setIsLoggedIn: () => { },
});

const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [_id, setId] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         const accessToken = await getCookie("accessToken");
    //         if (accessToken) {
    //             setIsLoggedIn(true);
    //             // Fetch user data from the server
    //             fetchUser()
    //                 .then((user) => {
    //                     setId(user._id);
    //                     setEmail(user.email);
    //                     setUsername(user.username);
    //                 })
    //                 .catch((err) => {
    //                     console.log(err);
    //                 });
    //         } else {
    //             setIsLoggedIn(false);
    //         }
    //     }

    //     fetchUserData();
    // });

    const value = {
        _id,
        setId,
        email,
        setEmail,
        username,
        setUsername,
        isLoggedIn,
        setIsLoggedIn
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, useAuth };
