import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User{
    id?:string;
    name:string;
    email:string;
    role?:string;
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
