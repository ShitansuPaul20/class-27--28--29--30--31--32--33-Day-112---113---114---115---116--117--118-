import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
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

export async function uploadUserSong(formData) {
    try {
        const response = await api.post('/api/songs/add', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data
    } catch (error) {
        console.log('Upload error:', error)
        throw error
    }
}

export async function getSongsByUser() {
    try {
        const response = await api.get('/api/songs/getSongs');
        return response.data;
    } catch (error) {
        console.error("Error fetching user songs:", error);
        throw error;
    }
};

export async function deleteUserSong(songId) {
    try {
        const response = await api.delete(`/api/songs/delete/${songId}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting song:", error);
        throw error;
    }
}

