import { LoginCredentials } from "@/interfaces/login/LoginCredentials";
import { LoginResponse } from "@/interfaces/login/LoginResponse";
import { API_URL } from "./apiConfig";
import Cookies from 'js-cookie'

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {

    try{
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
    });
        if(!response.ok){
            const errorData = await response.json();
            throw new Error('Usuario o contraseña incorrectos, intente nuevamente');
        }
        const userData: LoginResponse = await response.json();
        const { token } = userData

        // Save cookie
        Cookies.set('AUTH_TOKEN', token, {
            expires: 90,
            sameSite: 'strict'
        })
        return userData;
    } catch(error){
        console.error('Error en el login')
        throw error;
    }
}
