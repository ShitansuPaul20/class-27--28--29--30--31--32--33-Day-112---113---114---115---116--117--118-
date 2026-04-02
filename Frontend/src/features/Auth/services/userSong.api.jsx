import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vibee-jw9q.onrender.com/api/user-songs',
  withCredentials: true,
});

export async function uploadUserSong(formData) {
    try {
        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading song:', error);
        throw error;
    }
}

export async function getUserSongs() {
    try {
        const response = await api.get('/my-songs');
        return response.data;
    } catch (error) {
        console.error('Error fetching user songs:', error);
        throw error;
    }
}

export async function getSongsByMood(mood) {
    try {
        const response = await api.get(`/by-mood?mood=${mood}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching songs by mood:', error);
        throw error;
    }
}

export async function deleteUserSong(songId) {
    try {
        const response = await api.delete(`/${songId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting song:', error);
        throw error;
    }
}
