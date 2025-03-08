import axios from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,  // Use import.meta.env
    headers: {
        'Content-type': 'application/json',
        Accept: 'application/json'
    }
});


// list of all the end points
export const sendOtp = (data) => api.post('/api/send-otp', data);

export default api;