import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "@/providers";
import { setupToken } from "@/utils";

const HOME_PATH = '/login/vendor';

export function Logout() {
    const { setIsLogin, setAccount } = useContext(AuthContext);

    useEffect(() => {
        setIsLogin(false);
        setupToken(null, 'vendor');
        setAccount({
            role: 'vendor', profile: null
        });
    }, []);

    return <Navigate to={HOME_PATH} />;
}