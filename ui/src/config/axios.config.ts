import axios from "axios";
import { environment } from "../environment/environment";
import {notification} from 'antd'
import { encryptInput } from "../shared/shared-function";
import { API_ENDPOINTS } from "../shared/api-endpoints";
import { decodeToken } from "react-jwt";
import { differenceInSeconds } from "date-fns";
const API=axios.create({
    baseURL:environment.APP_API_URL
});


let refreshTokenPromise: Promise<string> | null = null;

const refreshToken = async():Promise<string>=>{
    if(refreshTokenPromise === null){
        refreshTokenPromise = (async () :Promise<string> =>{
            const inputBody={
                isSwitchRole:false
            }
            const encRefreshToken = encryptInput(sessionStorage?.refreshToken);
            try{
                const result = await API.post(`${API_ENDPOINTS.APP_TOKEN}`,JSON.stringify(inputBody),{
                    headers:{
                        'Content-Type':'application/json',
                        authType:'refresh_token',
                        refreshToken:encRefreshToken
                        
                    }
                });

                if(result.status ===200){
                    sessionStorage.setItem('accessToken',result.data.accessToken);
                    sessionStorage.setItem('refereshToken',result.data.refreshToken);
                    if(result.data.caRefreshToken){
                        sessionStorage.setItem('caRefreshToken',result.data.caRefreshToken);
                        sessionStorage.setItem('caAccessToken',result.data.caAccessToken);
                    }
                    return result.data.accessToken;
                }else{
                    sessionStorage.clear();
                    throw new Error('Token refresh failed')
                }
            }catch(error:any){
                if(error.response && error.response.data && error.response.data.code === 401){
                    sessionStorage.clear();
                    notification.warning({
                        message: 'Session Expired',
                        description: 'Please login again.',
                        duration: 3,
                        onClose: () => {
                            window.location.href = '/login';
                        },
                    });
                }
                throw error;

            }finally{
                refreshTokenPromise = null;
            }
        })();
    }

    return refreshTokenPromise;
}

const getBearerToken = async()=>{
    try{
        let token = sessionStorage.getItem('accessToken');
        let decodedToken:any = token ? decodeToken(token!): '';
        if(differenceInSeconds(new Date(decodedToken.exp*1000),new Date())<=0){
            return refreshToken();
            
        }else{
            return token;
        }
    }catch(error){
        return error;
    }
}

API.interceptors.request.use(
    async(config:any)=>{
        const token =await getBearerToken()
        if(token){
            return{
                ...config,
                headers:{
                    ...config.headers,
                    Authorization:`Bearer ${token}`,

                }
            }
        }
        return config;
    },

    (error:any)=>{
        return Promise.reject(error);
    }
)

API.interceptors.response.use(
    (response)=>{
        return response;
    },

    async(error:any)=>{
        if(error.response?.status ===401){
            window.location.href='/401';
        }else if(error.response?.status ===403){
            window.location.href='/403';
        }
        return Promise.reject(error);
    }
)

export default API;