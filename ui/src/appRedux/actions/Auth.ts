import { HIDE_MESSAGE, INIT_URL, ON_HIDE_LOADER, SHOW_MESSAGE } from "../../constants/ActionTypes"

export const ShowAuthMessage = (message:any)=>{
    return {
        type: SHOW_MESSAGE,
        payload: message
    }
}

export const setInitUrl = (url:any)=>{
    return {
        type: INIT_URL,
        payload: url
    }
}

export const hideMessage = () => {
    return {
        type: HIDE_MESSAGE
    }
}

export const hideAuthLoader = () => {
    return {
        type: ON_HIDE_LOADER
    }
}