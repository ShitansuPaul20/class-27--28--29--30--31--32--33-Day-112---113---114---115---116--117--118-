import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

export async function getSong({mood}) {
    try {
        const response = await api.get(`/api/songs/?mood=${mood}`);
        return response.data;
    } catch (error) {
        console.error("Error uploading song:", error);
        throw error;
    }
}