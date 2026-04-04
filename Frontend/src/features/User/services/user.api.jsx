import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/user",
    withCredentials: true,
});

api.interceptors.response.use(
  response => {
    if (response.status === 204) {
      return { data: { success: true }, status: 204 };
    }
    return response;
  },
  error => {
    console.log('Axios interceptor - error:', error);
    return Promise.reject(error);
  }
);


export async function fetchUserData() {
    try{
        console.log('API: Calling get-me endpoint');
        const response = await api.get('/get-me');
        console.log(response.data)
        return response.data;
        
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

export async function updateProfilePicture(file) {
    try {
        const formData = new FormData();
        formData.append('profilePicture', file);
        console.log("hui hui")
        const response = await api.put('/update-profile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.log('API: Update profile picture error:', error.message);
        throw error;
    }
}

export async function fetchUserStats() {
    try {
        console.log("lui lui")
        const response = await api.get('/stats');
        return response.data;
    } catch (error) {
        console.log('API: Fetch user stats error:', error.message);
        throw error;
    }
}

export async function fetchUserHistory() {
    try {
        console.log("pui pui")
        const response = await api.get('/history');
        return response.data;
    } catch (error) {
        console.log('API: Fetch user history error:', error.message);
        throw error;
    }
}