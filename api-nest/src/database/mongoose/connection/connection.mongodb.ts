import mongoose from "mongoose";
import { AppConfigService } from "../../../config/appconfig.service";
import { MongoConstants } from "./constants.mongodb";
import { HttpStatus } from "@nestjs/common";

export const mongooseProvider=[
    {
        provide:MongoConstants.MONGO_URI,
        useFactory:async (_appConfigservice:AppConfigService)=>{
            try{
                const dbconfig = _appConfigservice.get('database').mongodb;
                const connection = await mongoose.connect(dbconfig.uri,{
                    dbName:dbconfig.dbname,
                })

                // _logger.log('MongoDB connection successful',HttpStatus.OK);
                // process.on('SIGINT',async()=>{
                //     await mongoose.connection.close();
                //     _logger.log('MongoDB connection closed due to app termination',HttpStatus.OK);
                //     process.exit(0);
                // })

                return connection;
            }catch(error){
                // _logger.error('MongoDB connection error',error);
                throw error;
            }
            
        },
        inject:[AppConfigService]
    }
]