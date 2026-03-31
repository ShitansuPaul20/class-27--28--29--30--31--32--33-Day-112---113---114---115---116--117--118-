import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vibee-jw9q.onrender.com/api', // Update with your backend URL
  withCredentials: true, // Include cookies in requests
});


export async function register(username , email , password) {
    try{
        const response = await api.post('/register', { username, email, password });
        return response.data;
    }
    catch(error){
        console.log(error);
        throw error;
    }

}
export async function login(usernameorEmail, password) {
    try{
        const response = await api.post('/login', { emailOrUsername: usernameorEmail, password });
        return response.data;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}
export async function logout() {
    try{
        const response = await api.get('/logout');
        return response.data;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}
export async function fetchUserData() {
    try{
        const response = await api.get('/get-me');
        return response.data;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}