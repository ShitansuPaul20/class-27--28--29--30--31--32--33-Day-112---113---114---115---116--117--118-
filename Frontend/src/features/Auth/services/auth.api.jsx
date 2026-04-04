import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/auth',
  withCredentials: true,
});

export function loginWithGoogle() {
    window.location.href = 'http://localhost:3000/api/auth/google';
}

// Add response interceptor to handle 204 responses
api.interceptors.response.use(
  response => {
    // console.log('Axios interceptor - response status:', response.status);
    // Handle 204 No Content by returning success object
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


export async function register(username , email , password) {
    try{
        console.log('API: Calling register endpoint with username:', username);
        const response = await api.post('/register', { username, email, password });
        console.log('API: Register response:', response);
        // After interceptor, we always have response.data
        return { user: { username, email } };
    }
    catch(error){
        console.log('API: Register error caught:', error.message);
        console.log('API: Error response status:', error.response?.status);
        throw error;
    }

}
export async function login(usernameorEmail, password) {
    try{
        console.log('API: Calling login endpoint with:', usernameorEmail);
        const response = await api.post('/login', { emailOrUsername: usernameorEmail, password });
        console.log('API: Login response:', response);
        // After interceptor, we always have response.data
        return { user: { emailOrUsername: usernameorEmail } };
    }
    catch(error){
        console.log('API: Login error caught:', error.message);
        console.log('API: Error response status:', error.response?.status);
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



