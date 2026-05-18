import { Connection } from "mongoose";
import { MongoConstants } from "./constants.mongodb";
import { UserSchema } from "../schemas/user.schema";
import { SessionSchema } from "../schemas/session.schema";
import { Phone } from "../../../modules/phones/schemas/phone.schema";

export const MongoDbModelsProvider = [
    {
        provide:MongoConstants.USER_MODEL,
        useFactory:(connection:Connection)=>{
            return connection.model('User',UserSchema);
        },
        inject:[MongoConstants.MONGO_URI]
    },
    {
        provide:MongoConstants.SESSION_MODEL,
        useFactory:(connection:Connection)=>{
            return connection.model('Session',SessionSchema);
        },
        inject:[MongoConstants.MONGO_URI]
    },
    // {
    //     provider:MongoConstants.PHONES_MODEL,
    //     useFactory:(connection:Connection)=>{
    //         return connection.model('Phones',PhoneSchema);
    //     },
    //     inject:[MongoConstants.PHONES_MODEL]
    // },
    // {
    //     provider:MongoConstants.LAPTOP_MODEL,
    //     useFactory:(connection:Connection)=>{
    //         return connection.model('Laptops',LaptopSchema);
    //     },
    //     inject:[MongoConstants.LAPTOP_MODEL]
    // }
]