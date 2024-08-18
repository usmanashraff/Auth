import {create} from 'zustand'
import axios  from 'axios'

axios.defaults.withCredentials = true
const AUTH_API_URL= import.meta.env.MODE === "development" ? 'http://localhost:5000/api/auth':`${import.meta.env.VITE_SERVER_API}/api/auth`

export const useAuthstore = create((set)=>({
    user:null,
    isAuthenticated:false,
    error:null,
    isLoading:false,
    isCheckingAuth:true,
    message:null,

    signup: async(email,password,name)=>{
        set({isLoading:true, error:null})
        try {
            const response = await axios.post(`${AUTH_API_URL}/signup`, {email, password, name})
            set({user: response.data.user, isAuthenticated: true, isLoading: false})
        } catch (error) {
            set({error: error.response.data.message || 'error signing up', isLoading:false})
            throw error;
        }
    },


    signin: async(email,password)=>{
        set({isLoading:true, error:null})
        try {
            const response = await axios.post(`${AUTH_API_URL}/signin`, {email, password})
            set({user: response.data.user, isAuthenticated: true, isLoading: false})
        } catch (error) {
            set({error: error.response.data.message || 'error signing in', isLoading:false})
            throw error;
        }
    },
    logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${AUTH_API_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},

    verifyEmail: async(code)=>{
        set({isLoading:true, error:null})
        try {
            const response = await axios.post(`${AUTH_API_URL}/verify-email`, {code})
            set({user: response.data.user, isAuthenticated: true, isLoading: false})
            return response.data
        } catch (error) {
            set({error: error.response.data.message || 'error verifying email', isLoading:false})
            throw error;
        }
    },
    checkAuth: async()=>{
        set({error:null, isCheckingAuth: true})
        try {
            const response = await axios.get(`${AUTH_API_URL}/check-auth`)
            set({user:response.data.user, isAuthenticated: true, isCheckingAuth:false})
        } catch (error) {
            set({error: null , isAuthenticated: false, isCheckingAuth:false})
        }
    },
    forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${AUTH_API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},
    resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${AUTH_API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},
}))