import { Treatment } from "@/interfaces/treatment/Treatment"
import { API_URL } from "./apiConfig"

export const getTreatments = async(): Promise<Treatment[]> => {
    try {
        const response = await fetch(`${API_URL}/treatment`)
        if(!response.ok){
            throw new Error('Error to get treatments')
        }
        return await response.json()
    } catch (error) {
        throw error
    }
}