import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "@/providers";
import { setupToken } from "@/utils";

const HOME_PATH = '/admin/login';

export function Logout() {
    const { setIsLogin } = useContext(AuthContext);

    useEffect(() => {
        setIsLogin(false);
        setupToken(null, 'admin');
    }, [])

    return <Navigate to={HOME_PATH} />;
}