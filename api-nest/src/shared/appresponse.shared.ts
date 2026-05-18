export interface AppResponse{
  code: number;
  message: string;
  data?: any;
  description?:any;
  timestamp?: string;
  path?: string;
}

export const createResponse =(code:number, message:string, data?:any):AppResponse=>{
  return{
    code,
    message,
    data
  }
} 
