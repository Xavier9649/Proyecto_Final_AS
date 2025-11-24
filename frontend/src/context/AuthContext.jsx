import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restaurar sesión desde localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem("userData");

        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                setUser(parsed);
            } catch (e) {
                console.error("Error al leer usuario guardado:", e);
                localStorage.removeItem("userData");
                localStorage.removeItem("authToken");
            }
        }

        setLoading(false);
    }, []);

    // LOGIN CORRECTO SEGÚN TU BACKEND
    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);

            console.log("Respuesta del Login:", response);

            // El backend devuelve: token + usuario:{...}
            const backendUser = response.usuario;

            if (!backendUser || !response.token) {
                throw new Error("Datos inválidos desde el servidor");
            }

            // Normalizamos el usuario
            const normalizedUser = {
                id: backendUser.id,
                name: backendUser.nombre,
                email: backendUser.email,
                role: backendUser.rol,  // <-- IMPORTANTE
                token: response.token
            };

            // Guardar sesión correctamente
            localStorage.setItem("authToken", response.token);
            localStorage.setItem("userData", JSON.stringify(normalizedUser));

            setUser(normalizedUser);
            return true;

        } catch (error) {
            console.error("Error en Login Context:", error);
            throw error;
        }
    };

    const register = async (data) => {
        try {
            const response = await authService.register(data);
            return response;
        } catch (error) {
            console.error("Error en Registro Context:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

