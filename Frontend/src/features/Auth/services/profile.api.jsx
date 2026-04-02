import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vibee-jw9q.onrender.com/api/auth',
  withCredentials: true,
});

export async function updateProfile(fullName, profilePicture) {
    try {
        const response = await api.put('/update-profile', {
            fullName,
            profilePicture
        });
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
}

export async function getUserStats() {
    try {
        const response = await api.get('/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching user stats:', error);
        throw error;
    }
}

export async function addToHistory(songTitle, mood, type) {
    try {
        const response = await api.post('/add-to-history', {
            songTitle,
            mood,
            type
        });
        return response.data;
    } catch (error) {
        console.error('Error adding to history:', error);
        throw error;
    }
}
