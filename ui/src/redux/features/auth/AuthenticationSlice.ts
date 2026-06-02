import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import API from "../../../config/axios.config";

interface User{
    id?:string;
    name:string;
    email:string;
    role?:string|undefined;
    image_url?: string;
}

interface AuthState{
    user:User|null;
    token:string | null;
    isAuthenticated:boolean
}

// 1. Helper to safely read user data
const loadUserFromStorage = () => {
    try {
        const storedUser = sessionStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    } catch {
        return null;
    }
};

// 2. This is the magic part! It checks storage BEFORE Redux starts.
const initialState: AuthState = {
    user: loadUserFromStorage(),
    token: sessionStorage.getItem('accessToken') || null,
    // If an access token exists in storage, start the app as logged in!
    isAuthenticated: !!sessionStorage.getItem('accessToken'),
}

export const performLogout = createAsyncThunk(
    'auth/performLogout',
    async (_, { dispatch }) => {
        try {
            // Call the backend endpoint to clear the HttpOnly cookie and revoke the session
            await API.post('/api/auth/logout');
        } catch (error) {
            console.error("Backend logout failed, but clearing local state anyway.", error);
        } finally {
            // Always clear the local Redux/SessionStorage state
            dispatch(logout());
        }
    }
);

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        login:(state,action:PayloadAction<{user:User,token:string}>)=>{
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },

        logout:(state)=>{
            state.user =null;
            state.token=null;
            state.isAuthenticated = false;

            sessionStorage.removeItem('user');
            sessionStorage.removeItem('accessToken');
        },
    }
})

export const {login,logout} = authSlice.actions

export default authSlice.reducer;
